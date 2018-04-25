// theses metas will be injected in by the html-webpack-plugin

const title = '';
const fullURL = '';

const keywords = '';
const desc_search = '';
const desc_social = '';
const social_image = '';
const twitter_site = '';
const twitter_creator = '';

module.exports = {

  // viewport
  viewport: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui',

  // prevent phone number auto-detection (Safari iOS & Blackberry)
  'format-detection': 'telephone=no',
  httpEquiv: {
    'http-equiv': 'x-rim-auto-match',
    content: 'none'
  },

  // search engines
  'description': desc_search,
  'keywords': keywords,

  // google+
  googlePlusName: {
    itemprop: 'name',
    content: title,
  },
  googlePlusDescription: {
    itemprop: 'description',
    content: desc_social,
  },
  googlePlusImage: {
    itemprop: 'image',
    content: fullURL+'/'+social_image,
  },

  // twitter cards
  'twitter:card': 'summary_large_image',
  'twitter:site': twitter_site,
  'twitter:creator': twitter_creator,
  'twitter:title': title,
  'twitter:description': desc_social,
  'twitter:image': fullURL+'/'+social_image,

  // Open Graph
  OpenGraphTitle: {
    property: 'og:title',
    content: title
  },
  OpenGraphType: {
    property: 'og:type',
    content: 'website'
  },
  OpenGraphUrl: {
    property: 'og:url',
    content: fullURL
  },
  OpenGraphImage: {
    property: 'og:image',
    content: fullURL+'/'+social_image
  },
  OpenGraphDescription: {
    property: 'og:description',
    content: desc_social
  },
  OpenGraphSite_name: {
    property: 'og:site_name',
    content: title
  },

};
