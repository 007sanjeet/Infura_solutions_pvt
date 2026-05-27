const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      experienceLevel,
      jobType,
      categoryId,
      isFeatured,
      status, // ACTIVE or INACTIVE. Public defaults to ACTIVE.
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query condition
    const where = {};

    // Standard public filter only shows active listings
    if (status) {
      where.status = status;
    } else {
      where.status = 'ACTIVE';
    }

    if (isFeatured) {
      where.isFeatured = isFeatured === 'true';
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { requirements: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get count
    const total = await prisma.job.count({ where });

    // Get paginated jobs
    const jobs = await prisma.job.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    return res.status(200).json({
      jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job position not found.' });
    }

    return res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const getSimilarJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    const currentJob = await prisma.job.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!currentJob) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const similar = await prisma.job.findMany({
      where: {
        categoryId: currentJob.categoryId,
        status: 'ACTIVE',
        NOT: { id },
      },
      include: {
        category: true,
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(similar);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements,
      skills, // Array or string JSON
      experienceLevel,
      salaryRange,
      location,
      jobType,
      status,
      isFeatured,
      deadline,
      categoryId,
    } = req.body;

    if (!title || !description || !requirements || !categoryId) {
      return res.status(400).json({ error: 'Title, description, requirements, and categoryId are required.' });
    }

    // Verify category exists
    const category = await prisma.jobCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Invalid job category ID.' });
    }

    const formattedSkills = typeof skills === 'string' ? skills : JSON.stringify(skills || []);

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        skills: formattedSkills,
        experienceLevel: experienceLevel || 'Not Specified',
        salaryRange: salaryRange || 'Negotiable',
        location: location || 'Remote',
        jobType: jobType || 'Full-Time',
        status: status || 'ACTIVE',
        isFeatured: isFeatured === true || isFeatured === 'true',
        deadline: deadline ? new Date(deadline) : null,
        categoryId,
      },
    });

    return res.status(201).json({
      message: 'Job position created successfully.',
      job: newJob,
    });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requirements,
      skills,
      experienceLevel,
      salaryRange,
      location,
      jobType,
      status,
      isFeatured,
      deadline,
      categoryId,
    } = req.body;

    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return res.status(404).json({ error: 'Job position not found.' });
    }

    if (categoryId) {
      const category = await prisma.jobCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Invalid job category ID.' });
      }
    }

    const formattedSkills = skills
      ? (typeof skills === 'string' ? skills : JSON.stringify(skills))
      : existingJob.skills;

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingJob.title,
        description: description !== undefined ? description : existingJob.description,
        requirements: requirements !== undefined ? requirements : existingJob.requirements,
        skills: formattedSkills,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : existingJob.experienceLevel,
        salaryRange: salaryRange !== undefined ? salaryRange : existingJob.salaryRange,
        location: location !== undefined ? location : existingJob.location,
        jobType: jobType !== undefined ? jobType : existingJob.jobType,
        status: status !== undefined ? status : existingJob.status,
        isFeatured: isFeatured !== undefined ? (isFeatured === true || isFeatured === 'true') : existingJob.isFeatured,
        deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : existingJob.deadline,
        categoryId: categoryId !== undefined ? categoryId : existingJob.categoryId,
      },
    });

    return res.status(200).json({
      message: 'Job position updated successfully.',
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job position not found.' });
    }

    await prisma.job.delete({ where: { id } });

    return res.status(200).json({ message: 'Job position deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  getSimilarJobs,
  createJob,
  updateJob,
  deleteJob,
};
