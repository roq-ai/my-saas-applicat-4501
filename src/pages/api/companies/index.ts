import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { companyValidationSchema } from 'validationSchema/companies';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCompanies();
    case 'POST':
      return createCompany();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCompanies() {
    const data = await prisma.company
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'company'));
    return res.status(200).json(data);
  }

  async function createCompany() {
    await companyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.feature?.length > 0) {
      const create_feature = body.feature;
      body.feature = {
        create: create_feature,
      };
    } else {
      delete body.feature;
    }
    if (body?.feedback?.length > 0) {
      const create_feedback = body.feedback;
      body.feedback = {
        create: create_feedback,
      };
    } else {
      delete body.feedback;
    }
    if (body?.goal?.length > 0) {
      const create_goal = body.goal;
      body.goal = {
        create: create_goal,
      };
    } else {
      delete body.goal;
    }
    const data = await prisma.company.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
