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
    priority = full
    changefreq = 'never'

    def items(self):
        return Blueprint.objects.all()


class HelpSitemap(Sitemap):
    priority = full
    changefreq = 'never'

    def items(self):
        return ['help']

    def location(self, page):
        return '/' + page
