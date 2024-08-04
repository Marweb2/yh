import HiddenPublicationModel from "@/lib/models/hidden-publication-model";
import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
} from "@/lib/function";
import UserModel from "@/lib/models/user.model";

export const POST = async (req, { params }) => {
  try {
    const { user, publication } = params;
    await validateUserId(user, UserModel);
    const isAlreadyHidden = await HiddenPublicationModel.findOne({
      publication,
      user,
    });
    if (!isAlreadyHidden) {
      const hiddenPublication = await HiddenPublicationModel.create({
        publication,
        user,
      });
      return createJsonResponse({ hidden: true });
    } else {
      return createErrorResponse("This publication is already hidden", 409);
    }
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
