import { AppError } from "../utils/appError";
import { Gig } from "../models/Gig.model";
import { Bid } from "../models/Bid.model";
import { StatusTypes } from "../models/Gig.model";

export const gigCreate = async (data: {
  ownerId: string;
  title: string;
  description: string;
  budget: number;
}) => {
  const newGig = await Gig.create({
    ownerId: data.ownerId,
    title: data.title,
    description: data.description,
    budget: data.budget
  });

  return { gig: newGig, message: "Your gig is created" };
};



export const getAllOpenGigs = async (query: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const filter: any = {
    status: StatusTypes.OPEN
  }
  if (query.search) {
    filter.title = {
      $regex: query.search,
      $options: "i"
    };
  }
  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .select("title description budget ownerId createdAt")
      .populate("ownerId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Gig.countDocuments(filter)
  ]);

  return {
    gigs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  }
}

export const deleteGig = async (gigId: string, ownerId: string) => {
  const gig = await Gig.findOne({ _id: gigId, ownerId: ownerId });
  if (!gig) {
    throw new AppError("the gig is not found", 404);
  }
  if (gig.status !== StatusTypes.OPEN) {
    throw new AppError("The gig is not allowed to delete", 404);
  }
  await gig.deleteOne();

  return "the gig is deleted sucessfully"
}


// getting the user spcific gigs 

export const getMyGigsService = async (
  ownerId: string,
  query: {
    page?: number;
    limit?: number;
    status?: StatusTypes;
  }
) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter: any = {
    ownerId
  };

  // Optional status filter (client dashboard)
  if (query.status) {
    filter.status = query.status;
  }

  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .select("title description budget status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Gig.countDocuments(filter)
  ]);

  return {
    gigs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const bidForMygig = async (
  gigId: string,
  ownerId: string
) => {
  const gig = await Gig.findOne({ id: gigId, ownerId: ownerId });
  if (!gig) {
    throw new AppError("the gig is not found ", 404);
  }
  const bids = await Bid.find({ gigid: gigId })
  .select("price message status freelancerId createdAt")
  .populate("freelancerId","name email")
  .sort({createdAt:-1});

  return bids;

}