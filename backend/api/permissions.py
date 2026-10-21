from rest_framework.permissions import BasePermission
from api.models import UserRole

class IsSuperAdminUser(BasePermission):
    """
    Strict server-side role check:
    Allows access only to authenticated users whose database profile role is SUPER_ADMIN.
    Rejects any unauthenticated user (401) or non-super-admin user (403).
    Ignores any client-supplied role parameters or headers.
    """
    message = "Access Denied: This endpoint strictly requires Super Administrator privileges."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Resolve real role from database profile
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return False
            
        return profile.role == UserRole.SUPER_ADMIN

class IsProctorUser(BasePermission):
    """
    Strict server-side role check:
    Allows access only to authenticated users whose database profile role is
    INVIGILATOR, EXAM_CONTROLLER, CENTER_ADMIN, or SUPER_ADMIN.
    Candidates and unauthorized roles receive 403 Forbidden.
    """
    message = "Access Denied: This endpoint strictly requires Proctor / Invigilator examination privileges."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return False
            
        return profile.role in [
            UserRole.INVIGILATOR,
            UserRole.EXAM_CONTROLLER,
            UserRole.CENTER_ADMIN,
            UserRole.SUPER_ADMIN,
        ]
