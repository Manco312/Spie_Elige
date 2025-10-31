from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.urls import reverse
from django.contrib import messages
from django.db.models import Sum
from .models import Voter, Election, Option, Delegation, Vote
from .forms import AdminLoginForm, VoterForm, ElectionForm, OptionForm, DelegationForm

# ---------------- Helper ----------------
def admin_required(view):
    def wrapped(request, *args, **kwargs):
        if not request.session.get('is_spie_admin'):
            return redirect('admin_login')
        return view(request, *args, **kwargs)
    return wrapped

def compute_delegation_weight(voter):
    """Cuántos votos le llegan a voter (excluding su propio voto)"""
    return Delegation.objects.filter(to_voter=voter).count()

# -------------- VOTER LANDING / VOTER FLOW --------------
def landing(request):
    cedula = ''
    if request.method == 'POST':
        cedula = request.POST.get('cedula', '').strip()
        try:
            voter = Voter.objects.get(cedula=cedula)
        except Voter.DoesNotExist:
            messages.error(request, "La cédula no está registrada como votante.")
            return render(request, 'voting/landing.html', {'cedula': cedula})
        # Si cedió su voto (está delegada), no puede votar
        if Delegation.objects.filter(from_voter=voter).exists():
            messages.error(request, "Usted ha cedido su voto y no está habilitado para votar.")
            return render(request, 'voting/landing.html', {'cedula': cedula})
        if not voter.active:
            messages.error(request, "Usted no está habilitado para votar.")
            return render(request, 'voting/landing.html', {'cedula': cedula})
        # guardar en sesión el voter_id para el flujo de votación
        request.session['voter_id'] = voter.id
        return redirect('voter_dashboard')
    return render(request, 'voting/landing.html', {'cedida': False, 'cedula': cedula})

def voter_dashboard(request):
    voter_id = request.session.get('voter_id')
    if not voter_id:
        return redirect('landing')
    voter = get_object_or_404(Voter, id=voter_id)
    # elecciones donde NO ha votado aún
    voted_elections = Vote.objects.filter(voter=voter).values_list('election_id', flat=True)
    elections = Election.objects.exclude(id__in=voted_elections).order_by('fecha_creacion')
    # si es receptor de delegaciones, calcular peso adicional
    delegations_received = Delegation.objects.filter(to_voter=voter).count()
    weight = 1 + delegations_received
    return render(request, 'voting/voter_dashboard.html', {
        'voter': voter,
        'elections': elections,
        'weight': weight,
        'delegations_received': delegations_received,
    })

def vote_page(request, election_id):
    voter_id = request.session.get('voter_id')
    if not voter_id:
        return redirect('landing')
    voter = get_object_or_404(Voter, id=voter_id)
    election = get_object_or_404(Election, id=election_id)
    # verificar que no haya votado ya en esta elección
    if Vote.objects.filter(voter=voter, election=election).exists():
        messages.error(request, "Ya hiciste tu voto en esta elección.")
        return redirect('voter_dashboard')
    # Si votó delegante no puede votar: esto se chequeó en landing, pero doble verificación
    if Delegation.objects.filter(from_voter=voter).exists():
        messages.error(request, "Usted ha cedido su voto y no está habilitado para votar.")
        return redirect('landing')
    # calcular peso (1 + cantidad de delegaciones recibidas)
    delegations_received = Delegation.objects.filter(to_voter=voter).count()
    weight = 1 + delegations_received
    if request.method == 'POST':
        option_id = request.POST.get('option')
        if not option_id:
            messages.error(request, "Selecciona una opción.")
            return redirect('vote_page', election_id=election.id)
        option = get_object_or_404(Option, id=option_id, election=election)
        Vote.objects.create(voter=voter, election=election, option=option, weight=weight)
        messages.success(request, f"Voto registrado (valor: {weight}). ¡Gracias por participar!")
        # opcional: remover session voter_id para forzar re-login (pero mantendremos)
        return redirect('voter_dashboard')
    options = election.options.all()
    return render(request, 'voting/vote_page.html', {
        'voter': voter,
        'election': election,
        'options': options,
        'weight': weight,
        'delegations_received': delegations_received,
    })

# ---------------- ADMIN (LOGIN FIJO) ----------------
def admin_login(request):
    if request.session.get('is_spie_admin'):
        return redirect('admin_panel')
    form = AdminLoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        u = form.cleaned_data['username']
        p = form.cleaned_data['password']
        if u == settings.SPIE_ADMIN_USERNAME and p == settings.SPIE_ADMIN_PASSWORD:
            request.session['is_spie_admin'] = True
            return redirect('admin_panel')
        else:
            messages.error(request, "Credenciales inválidas.")
    return render(request, 'voting/admin_login.html', {'form': form})

def admin_logout(request):
    request.session.pop('is_spie_admin', None)
    return redirect('admin_login')

@admin_required
def admin_panel(request):
    total_voters = Voter.objects.count()
    total_elections = Election.objects.count()
    total_delegations = Delegation.objects.count()
    total_votes = Vote.objects.count()
    return render(request, 'voting/admin_panel.html', {
        'total_voters': total_voters,
        'total_elections': total_elections,
        'total_delegations': total_delegations,
        'total_votes': total_votes,
    })

# ---- Voters management ----
@admin_required
def admin_voters(request):
    voters = Voter.objects.all().order_by('nombre')
    return render(request, 'voting/admin_voters.html', {'voters': voters})

@admin_required
def admin_add_voter(request):
    if request.method == 'POST':
        form = VoterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Votante agregado.")
            return redirect('admin_voters')
    else:
        form = VoterForm()
    return render(request, 'voting/admin_voters.html', {'form': form, 'voters': Voter.objects.all()})

@admin_required
def admin_delete_voter(request, voter_id):
    v = get_object_or_404(Voter, id=voter_id)
    v.delete()
    messages.success(request, "Votante eliminado.")
    return redirect('admin_voters')

# ---- Delegations management ----
@admin_required
def admin_delegations(request):
    delegs = Delegation.objects.select_related('from_voter', 'to_voter').all()
    voters = Voter.objects.all()
    form = DelegationForm()
    return render(request, 'voting/admin_delegations.html', {'delegs': delegs, 'voters': voters, 'form': form})

@admin_required
def admin_add_delegation(request):
    if request.method == 'POST':
        form = DelegationForm(request.POST)
        if form.is_valid():
            deleg = form.save(commit=False)
            # marcar al from_voter como inactivo para votar
            deleg.from_voter.active = False
            deleg.from_voter.save()
            deleg.save()
            messages.success(request, "Delegación registrada.")
        else:
            messages.error(request, "Error al registrar delegación. Verifica que un votante no haya delegado ya.")
    return redirect('admin_delegations')

@admin_required
def admin_delete_delegation(request, deleg_id):
    d = get_object_or_404(Delegation, id=deleg_id)
    # re-habilitar al from_voter
    fv = d.from_voter
    fv.active = True
    fv.save()
    d.delete()
    messages.success(request, "Delegación eliminada.")
    return redirect('admin_delegations')

# ---- Elections management ----
@admin_required
def admin_elections(request):
    elections = Election.objects.all().order_by('-fecha_creacion')
    addition_form = ElectionForm()
    option_form = OptionForm()
    return render(request, 'voting/admin_elections.html', {
        'elections': elections,
        'addition_form': addition_form,
        'option_form': option_form,
    })

@admin_required
def admin_add_election(request):
    if request.method == 'POST':
        form = ElectionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Elección creada.")
    return redirect('admin_elections')

@admin_required
def admin_add_option(request, elec_id=None):
    if request.method == 'POST':
        election_id = request.POST.get('election_id') or elec_id
        election = get_object_or_404(Election, id=election_id)
        form = OptionForm(request.POST)
        if form.is_valid():
            opt = form.save(commit=False)
            opt.election = election
            opt.save()
            messages.success(request, "Opción agregada.")
    return redirect('admin_elections')

# ---- Results ----
@admin_required
def admin_results(request):
    elections = Election.objects.all().order_by('-fecha_creacion')
    results = []
    for e in elections:
        opts = e.options.all()
        opt_results = []
        for o in opts:
            agg = Vote.objects.filter(election=e, option=o).aggregate(total=Sum('weight'))
            total = agg['total'] or 0
            opt_results.append({'option': o, 'total': total})
        results.append({'election': e, 'opt_results': opt_results})
    return render(request, 'voting/admin_results.html', {'results': results})
