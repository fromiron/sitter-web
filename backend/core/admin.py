"""
django admin
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from . import models


class UserAdmin(BaseUserAdmin):
    """
    adminパネルに表示する内容を指定
    """
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
            _('Permissions'),
            {'fields': (
                'is_active',
                'is_staff',
                'is_superuser'
            )}
        ),
        (_('Important dates'), {'fields': ('last_login',)})
    )
    readonly_fields = ['last_login', 'is_superuser']

    ordering = ['id']
    list_display = ['email', 'name',
                    'is_active', 'is_staff', 'is_superuser']
    search_fields = ['email', 'name']
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'name',
                'password1',
                'password2',
                'name',
                'is_active',
                'is_staff',
            )
        }),
    )


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Customer)
admin.site.register(models.CustomerMemo)
admin.site.register(models.Pet)
admin.site.register(models.PetMemo)
admin.site.register(models.PetType)
admin.site.register(models.PetBreed)
