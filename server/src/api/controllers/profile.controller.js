import prisma from '../../prisma/client.js';

export const profileComplete = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.id; 
    // req.user.id if you have auth middleware, else fallback

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // fields allowed to update during completion
    const { bio, location, profilePic, phoneno, metadata } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        location,
        profilePic,
        phoneno,
        metadata,
        profileComplete: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        location: true,
        profilePic: true,
        phoneno: true,
        profileComplete: true,
      },
    });

    return res.status(200).json({
      message: "Profile completed successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile completion failed:", err);
    return res.status(500).json({
      error: "Could not complete profile.",
      details: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // Auth middleware must set this
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileComplete: true,
        bio: true,
        location: true,
        profilePic: true,
        phoneno: true,
        metadata: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const createStartupProfile = async (req, res) => {
  if (req.userData.role !== 'ENTREPRENEUR') {
    return res.status(403).json({ message: 'Forbidden: Only entrepreneurs can create startups.' });
  }
  
  try {
    const { name, industry, fundingNeeded , ownerId,  pitchThumbNail,pitchLogo, description, metadata } = req.body;

    const startup = await prisma.startup.create({
      data: {
        name,
        industry,
        fundingNeeded,
        ownerId,
        pitchThumbNail,
        pitchLogo,
        description,
        metadata
      },
    });

    res.status(201).json({ message: 'Startup profile created!', startup });
  } catch (error) {
    res.status(500).json({ message: 'Error creating startup profile.', error: error.message });
  }
};
