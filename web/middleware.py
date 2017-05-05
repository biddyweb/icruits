from django.template import TemplateDoesNotExist
import re
from django.shortcuts import render_to_response
import logging
from django.utils.deprecation import MiddlewareMixin


class PrerenderMiddleware(MiddlewareMixin):

    LOGGER = logging.getLogger('prerender')

    @staticmethod
    def _is_bot(request):
        is_google = '_escaped_fragment_' in request.GET
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        return is_google or re.search('GoogleBot|'
                                      'Bingbot|'
                                      'Slurp|'
                                      'YandexBot|'
                                      'Exabot|'
                                      'DuckDuckBot|'
                                      'baiduspider|'
                                      'twitterbot|'
                                      'facebookexternalhit/1.1|'
                                      'rogerbot|linkedinbot|'
                                      'embedly|'
                                      'quora link preview|'
                                      'showyoubot|'
                                      'outbrain|'
                                      'pinterest|'
                                      'i686',
                                      user_agent)

    def process_request(self, request):
        if self._is_bot(request):
            template = 'snapshots%sindex.html' % request.path
            try:
                return render_to_response(template)
            except TemplateDoesNotExist:
                self.LOGGER.error('Snapshot template %s from path %s not found' % (template, request.path))
