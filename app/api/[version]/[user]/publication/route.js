import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getAssistantId } from "@/lib/function";
import UserModel from "@/lib/models/user.model";
import PublicationModel from "@/lib/models/publication-model";
import UnfollowModel from "@/lib/models/unfollow-model";
import HiddenPublicationModel from "@/lib/models/hidden-publication-model";
import PublicationFilterModel from "@/lib/models/publication-filters-models";
import {
  createErrorResponse,
  createJsonResponse,
  validateUserId,
  extractUnfollowedIds,
  extractPublicationIds,
} from "@/lib/function";

export const POST = async (req, { params }) => {
  try {
    const { user } = params;
    await validateUserId(user, UserModel);
    const body = await req.json();
    console.log(body);
    const publication = await PublicationModel.create({
      ...body,
      user,
    });
    return createJsonResponse(publication);
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
export const GET = async (req, { params }) => {
  try {
    const { user } = params;
    const filter = req.nextUrl.searchParams.get("filter");

    console.log(filter);
    const data = await validateUserId(user, UserModel);
    let publications;
    if (filter === "news_feed") {
      const unfollowedUsers = await UnfollowModel.find({ user });
      const hiddenPublication = await HiddenPublicationModel.find({ user });
      const filters = await PublicationFilterModel.findOne({ user });
      const unfollowedUserIds = extractUnfollowedIds(unfollowedUsers);
      const hiddenPublicationIds = extractPublicationIds(hiddenPublication);

      if (filters?.noFilter || !filters) {
        publications = await PublicationModel.find({
          user: { $nin: [...unfollowedUserIds] },
          _id: { $nin: hiddenPublicationIds },
          place: "news_feed",
        })
          .populate({
            path: "user",
            select: "name username image statutProfessionnelle",
          })
          .sort({ createdAt: -1 })
          .lean();
      } else {
        const comp =
          data.userType === "client"
            ? filters?.filter
            : [...filters?.filter, ...data.competenceVirtuelle];
        publications = await PublicationModel.find({
          user: { $nin: [...unfollowedUserIds] },
          _id: { $nin: hiddenPublicationIds },
          competence: { $in: comp },
          place: "news_feed",
        })
          .populate({
            path: "user",
            select: "name username image statutProfessionnelle",
          })
          .sort({ createdAt: -1 })
          .lean();
      }
    } else if (filter === "my_articles") {
      publications = await PublicationModel.find({
        user,
        place: "my_articles",
      })
        .populate({
          path: "user",
          select: "name username image statutProfessionnelle",
        })
        .sort({ createdAt: -1 })
        .lean();
    }
    publications = publications.map((data) => {
      if (data.attachmentType !== "document") {
        return data;
      } else {
        return {
          ...data,
          attachment: null,
        };
      }
    });
    return createJsonResponse(publications);
  } catch (error) {
    return createErrorResponse(error.message);
  }
};
