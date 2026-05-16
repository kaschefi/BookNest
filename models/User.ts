import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
    {
        // CHANGED: unified provider system (github/google/apple/local)
        provider: {
            type: String,
            enum: ["local", "github", "google", "apple"],
            required: true
        },

        // CHANGED: provider unique identifier
        providerId: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },

        studentId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field"
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        accounts: {
            type: [AccountSchema],
            default: []
        },

        password: {
            type: String,
            select: false,

            // CHANGED: avoid TS + runtime "this.accounts" issues by explicit typing
            required: function (this: any) {
                const hasLocalAccount = this.accounts?.some(
                    (a: any) => a.provider === "local"
                );

                return !hasLocalAccount;
            }
        },

        role: {
            type: String,
            enum: ["guest", "user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

// indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ studentId: 1 }, { unique: true, sparse: true });

// CHANGED: enforce provider uniqueness per user
UserSchema.index(
    { "accounts.provider": 1, "accounts.providerId": 1 },
    { unique: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);