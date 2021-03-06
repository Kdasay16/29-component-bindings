'use strict'

require('./_home.scss')

module.exports = [
  '$log',
  '$rootScope',
  '$window',
  '$location',
  'authService',
  'galleryService',
  function($log, $rootScope, $window, $location, authService, galleryService) {
    this.$onInit = () => {
      $log.debug('HomeController()')
      if(!$window.localStorage.token) {
        authService.getToken()
        .then(
          () => $location.url('/home'),
          () => $location.url('/signup')
        )
      }
      this.galleries = []

      this.fetchGalleries = () => {
        return galleryService.fetchGalleries()
        .then(galleries => {
          this.galleries = galleries
          this.currentGallery= this.galleries[0]
        })
        .catch(err => $log.error(err))
      }

      $rootScope.$on('locationChangeSuccess', this.fetchGalleries)
      $rootScope.$on('newGalleryCreated', this.fetchGalleries)
      $rootScope.$on('updateCurrentGallery', (gallery) => {
        for(let i = 0; i < this.galleries.length; i++) {
          if(this.galleries[i]._id === gallery._id) {
            this.currentGallery = this.galleries[i]
            break
          }
        }
      })
      this.fetchGalleries()
    }
  }
]
