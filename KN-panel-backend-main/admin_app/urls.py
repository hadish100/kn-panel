from django.urls import path
from admin_app import views

urlpatterns = [
    ### Agent URLs
    # Create Agent URL
    path("agent/create/", views.AdminAgentCreate.as_view(), name="agent_create_with_admin"),

    # Edit Agent URL
    path("agent/edit/", views.AdminAgentUpdate.as_view(), name="agent_edit_with_admin"),

    # Delete Agent URL
    path("agent/delete/", views.AdminAgentDelete.as_view(), name="agent_delete_with_admin"),

    # Disable Agent URL
    path("agent/disable/", views.disable_agent, name="agent_disable_with_admin"),

    # View Agents URL
    path("agents/", views.AdminAgentProfiles.as_view(), name="agent_view_with_admin"),

    # Off the Agent Actions
    path("agent/off/", views.OffAgentOptions.as_view(), name="agent_off_actions"),

    # On the Agent Actions
    path("agent/on/", views.OnAgentOptions.as_view(), name="agent_on_actions"),
    ### Panel URLs
    # Panel Create
    path("panel/create/", views.CreatePanel.as_view(), name="panel_create_with_admin"),

    # Panel Delete
    path("panel/delete/", views.DeletePanel.as_view(), name="panel_delete_with_admin"),

    # Panel Disable
    path("panel/disable/", views.disable_panel, name="disable_panel_with_admin"),

    # View Panel
    path("panel/view/", views.PanelsView.as_view(), name="view_all_panel_with_admin"),

]