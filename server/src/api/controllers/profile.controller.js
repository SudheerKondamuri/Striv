import prisma from '../../prisma/client.js';

export const createStartupProfile = async (req, res) => {
  if (req.userData.role !== 'ENTREPRENEUR') {
    return res.status(403).json({ message: 'Forbidden: Only entrepreneurs can create startups.' });
  }
  
  try {
    const { name, industry, fundingNeeded } = req.body;
    const ownerId = req.userData.id; 

    const startup = await prisma.startup.create({
      data: {
        name,
        industry,
        fundingNeeded,
        ownerId, 
      },
    });

    res.status(201).json({ message: 'Startup profile created!', startup });
  } catch (error) {
    res.status(500).json({ message: 'Error creating startup profile.', error: error.message });
  }
};