import { model, Schema } from 'mongoose'

const UserMetadataSchema = new Schema(
  {
    _id: { type: String },
    password: { type: String, required: true, select: false },
    verificationToken: { type: String, select: false },
  },
  {
    collection: 'users-metadata',
    versionKey: false,
    // User metadata is important -- specify write concern of 'majority'.
    writeConcern: { w: 'majority', j: true, wtimeout: 5000 },
    timestamps: true,
    id: false, // No additional id as virtual getter.
  })

  // No specific indexes needed, since we'll always query based on _id (which must be the same as user model).

  export default model('UserMetadata', UserMetadataSchema)
