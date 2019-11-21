"""
Django dbsettings for mysite project.
"""

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "mypro",
        "USER": "root",
        "PASSWORD": "niu123",
    },
    "test": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "mypro",
        "USER": "root",
        "PASSWORD": "niu123",
    },
}


class AuthRouter:
    """
    A router to control all database operations on models in the
    auth application.
    """

    def db_for_read(self, model, **hints):
        """
        Attempts to read auth models go to auth_db.
        """
        if model._meta.app_label == 'test':
            return 'test'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to auth_db.
        """
        if model._meta.app_label == 'test':
            return 'test'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the auth app is involved.
        """
        if obj1._meta.app_label == 'test' or \
                obj2._meta.app_label == 'test':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the auth app only appears in the 'auth_db'
        database.
        """
        return None


DATABASE_ROUTERS = ['mainsys.dbconfig.AuthRouter', ]
