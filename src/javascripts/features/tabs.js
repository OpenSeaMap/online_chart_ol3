/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import React from 'react'

import LayerConfig from './layerConfig/featureLayerConfig'
import { MdLayers } from 'react-icons/lib/md'

import FeatureDetails from './details/featureDetails'
import { FaTags } from 'react-icons/lib/fa'

import FeatureDevelopment from './development/featureDevelopment'
import { FaInfoCircle } from 'react-icons/lib/fa'

export const Tabs = [{
  name: 'sidebar-settings',
  align: 'top',
  icon: <MdLayers />,
  content: <LayerConfig/>
}, {
  name: 'sidebar-details',
  align: 'top',
  icon: <FaTags />,
  content: <FeatureDetails />
}, {
  name: 'sidebar-development',
  align: 'bottom',
  icon: <FaInfoCircle />,
  content: <FeatureDevelopment />
}];
