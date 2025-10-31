from django.contrib import admin
from .models import Voter, Election, Option, Delegation, Vote

@admin.register(Voter)
class VoterAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cedula', 'active')

class OptionInline(admin.TabularInline):
    model = Option
    extra = 1

@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha_creacion')
    inlines = [OptionInline]

@admin.register(Delegation)
class DelegationAdmin(admin.ModelAdmin):
    list_display = ('from_voter', 'to_voter', 'created_at')

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('voter', 'election', 'option', 'weight', 'timestamp')
