import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: () => true,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['story', 'author', 'status', 'createdAt'],
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'story',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'stories',
      required: true,
      index: true,
    },
    {
      name: 'chapter',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'chapters',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Comment',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'author',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
  timestamps: true,
}
