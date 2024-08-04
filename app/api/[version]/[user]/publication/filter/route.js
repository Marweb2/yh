import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getAssistantId } from "@/lib/function";
import UserModel from "@/lib/models/user.model";
import PublicationModel from "@/lib/models/publication-model";
import UnfollowModel from "@/lib/models/unfollow-model";
import HiddenPublicationModel from "@/lib/models/hidden-publication-model";
import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
  extractUnfollowedIds,
  extractPublicationIds,
} from "@/lib/function";
import PublicationFilterModel from "@/lib/models/publication-filters-models";

export const POST = async (req, { params }) => {
  try {
    const { user } = params;
    const userData = await validateUserId(user, UserModel);
    const body = await req.json();
    const filter = await PublicationFilterModel.findOne({ user });

    if (!filter) {
      await PublicationFilterModel.create({ ...body, user });
    } else {
      await PublicationFilterModel.findOneAndUpdate({ user }, body);
    }
    return createJsonResponse({ updated: true });
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
export const GET = async (req, { params }) => {
  try {
    const { user } = params;

    await validateUserId(user, UserModel);
    const filter = await PublicationFilterModel.findOne({ user });

    return createJsonResponse(filter);
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
