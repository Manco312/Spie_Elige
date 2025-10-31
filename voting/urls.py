from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name='landing'),
    path('voter/dashboard/', views.voter_dashboard, name='voter_dashboard'),
    path('vote/<int:election_id>/', views.vote_page, name='vote_page'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    path('admin/panel/', views.admin_panel, name='admin_panel'),
    path('admin/voters/', views.admin_voters, name='admin_voters'),
    path('admin/voters/add/', views.admin_add_voter, name='admin_add_voter'),
    path('admin/voters/delete/<int:voter_id>/', views.admin_delete_voter, name='admin_delete_voter'),
    path('admin/delegations/', views.admin_delegations, name='admin_delegations'),
    path('admin/delegations/add/', views.admin_add_delegation, name='admin_add_delegation'),
    path('admin/delegations/delete/<int:deleg_id>/', views.admin_delete_delegation, name='admin_delete_delegation'),
    path('admin/elections/', views.admin_elections, name='admin_elections'),
    path('admin/elections/add/', views.admin_add_election, name='admin_add_election'),
    path('admin/elections/<int:elec_id>/add_option/', views.admin_add_option, name='admin_add_option'),
    path('admin/results/', views.admin_results, name='admin_results'),
]
