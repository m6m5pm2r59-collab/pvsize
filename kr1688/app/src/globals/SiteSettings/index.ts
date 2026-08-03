import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'KR1688',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Site Identity',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              required: true,
              defaultValue: 'KR1688',
              label: 'Site Title',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description (Arabic)',
              defaultValue: 'منصة القصص العربية — اقرأ، شارك، واكتشف',
            },
            {
              name: 'siteDescriptionEn',
              type: 'textarea',
              label: 'Site Description (English)',
              defaultValue: 'Arabic Story Platform — Read, Share, Discover',
            },
          ],
        },
        {
          label: 'Locale & Direction',
          fields: [
            {
              name: 'defaultLocale',
              type: 'select',
              defaultValue: 'ar',
              label: 'Default Locale',
              options: [
                { label: 'العربية (Arabic)', value: 'ar' },
                { label: 'English', value: 'en' },
              ],
            },
            {
              name: 'defaultDirection',
              type: 'select',
              defaultValue: 'rtl',
              label: 'Default Text Direction',
              options: [
                { label: 'RTL (Right-to-Left)', value: 'rtl' },
                { label: 'LTR (Left-to-Right)', value: 'ltr' },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'primaryNav',
              type: 'array',
              label: 'Primary Navigation',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'labelAr',
                  type: 'text',
                  label: 'Label (Arabic)',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
              defaultValue: [
                { label: 'Stories', labelAr: 'القصص', url: '/stories' },
                { label: 'About', labelAr: 'عن المنصة', url: '/about' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
