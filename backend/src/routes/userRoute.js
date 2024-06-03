import { Router } from 'express';

const userRouter = Router();

userRouter.get('/:user_id', async (req, res) => {
  try {
    const { user_id: userId } = req.params;

    const projects = await Project.find({
      $or: [
        { admin: userId },
        { member: userId },
        { viewer: userId },
      ],
    })
      .populate('admin')
      .populate('member')
      .populate('viewer');

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).send({ message: 'Internal server error.' });
  }
});

export default userRouter;