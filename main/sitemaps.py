from django.contrib.sitemaps import Sitemap
from web.models import Blueprint
from django.urls import reverse

full = 1
half = 0.5


class HomeSitemap(Sitemap):
    priority = full
    changefreq = 'never'

    def items(self):
        return ['home']

    def location(self, page):
        return reverse(page)


class BlueprintSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return Blueprint.objects.all()


class HelpSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['help']

    def location(self, page):
        return '/' + page


class DashboardSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['dashboard']

    def location(self, page):
        return '/' + page


class ProfileSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['profile']

    def location(self, page):
        return '/' + page


class RegisterSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['register']

    def location(self, page):
        return '/' + page


class ActivateSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['activate']

    def location(self, page):
        return '/' + page


class NotPilotSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['not-approved']

    def location(self, page):
        return '/' + page


class CookiePolicy(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['cookie-policy']

    def location(self, page):
        return '/legal/' + page + '/'


class UserAgreementSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['user-agreement']

    def location(self, page):
        return '/legal/' + page + '/'


class TermsOfUseSitemap(Sitemap):
    priority = half
    changefreq = 'never'

    def items(self):
        return ['terms-of-use']

    def location(self, page):
        return '/legal/' + page + '/'
