from rest_framework.permissions import BasePermission,SAFE_METHODS

class IsAdminUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        if request.method == 'PUT' and not request.user.is_staff:
            return 'completed' in request.data
        
        return request.user.is_staff
        

        # if request.method in ('GET','PUT') and not request.user.is_staff:
        #     return True #allow employees to view and mark tasks as complete
        # return request.user.is_staff  #alllow only admins full crud operations
    


