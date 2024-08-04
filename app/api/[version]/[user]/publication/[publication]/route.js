import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
} from "@/lib/function";
import UserModel from "@/lib/models/user.model";
import PublicationModel from "@/lib/models/publication-model";

export const DELETE = async (req, { params }) => {
  try {
    const { user, publication } = params;
    await validateUserId(user, UserModel);
    await PublicationModel.findByIdAndDelete(publication);
    return createJsonResponse({ deleted: true });
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
