from django.db import models

class Voter(models.Model):
    nombre = models.CharField(max_length=200)
    cedula = models.CharField(max_length=50, unique=True)
    # si delego su voto a otro, quedará inhabilitado
    active = models.BooleanField(default=True)  # habilitado para votar personalmente

    def __str__(self):
        return f"{self.nombre} ({self.cedula})"

class Election(models.Model):
    titulo = models.CharField(max_length=200)  # e.g., "Presidente"
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

class Option(models.Model):
    election = models.ForeignKey(Election, related_name='options', on_delete=models.CASCADE)
    texto = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.texto} — {self.election.titulo}"

class Delegation(models.Model):
    # from_voter cede su voto a to_voter
    from_voter = models.OneToOneField(Voter, related_name='delegated_out', on_delete=models.CASCADE)
    to_voter = models.ForeignKey(Voter, related_name='delegated_in', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_voter} -> {self.to_voter}"

class Vote(models.Model):
    voter = models.ForeignKey(Voter, on_delete=models.CASCADE)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)
    weight = models.PositiveIntegerField(default=1)  # account for delegations received
    timestamp = models.DateTimeField(auto_now_add=True)

    #class Meta:
        #unique_together = ('voter', 'election')  # un voto por votante por elección

    def __str__(self):
        return f"{self.voter} votó {self.option} (x{self.weight})"
