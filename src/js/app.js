import Alpine from 'alpinejs'
import Slider from './Slider.js'
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)
window.Alpine = Alpine

Alpine.data('Slider', Slider)

Alpine.start()