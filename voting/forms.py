from django import forms
from .models import Voter, Election, Option, Delegation

class AdminLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

class VoterForm(forms.ModelForm):
    class Meta:
        model = Voter
        fields = ['nombre', 'cedula', 'active']

class ElectionForm(forms.ModelForm):
    class Meta:
        model = Election
        fields = ['titulo', 'descripcion']

class OptionForm(forms.ModelForm):
    class Meta:
        model = Option
        fields = ['texto']

class DelegationForm(forms.ModelForm):
    class Meta:
        model = Delegation
        fields = ['from_voter', 'to_voter']
