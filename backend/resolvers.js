const Task = require("./models/Task");
const { verifyAuthHeader } = require("./firebaseAdmin");

const normalizeTask = (taskDoc) => {
  if (!taskDoc) return null;

  const task = taskDoc.toObject ? taskDoc.toObject() : taskDoc;
  const taskId = task.id || task._id;

  return {
    ...task,
    id: taskId ? String(taskId) : null,
    priority: task.priority || "Medium",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : null,
  };
};

const getUserFromContext = async (context) => {
  const authHeader =
    context?.req?.headers?.authorization ||
    context?.req?.headers?.Authorization;
  const decoded = await verifyAuthHeader(authHeader);

  if (!decoded?.email) {
    throw new Error("Unauthorized: User email not found in token");
  }

  return decoded;
};

const getOwnershipFilter = (user) => ({
  $or: [{ user: user.email }, { userEmail: user.email }, { userId: user.uid }],
});

const resolvers = {
  tasks: async (args, context) => {
    const user = await getUserFromContext(context);
    const ownershipFilter = getOwnershipFilter(user);

    const tasks = await Task.find(ownershipFilter).sort({
      createdAt: -1,
    });
    return tasks.map(normalizeTask);
  },
  addTask: async ({ title, description, dueDate, priority }, context) => {
    const user = await getUserFromContext(context);
    const task = new Task({
      user: user.email,
      userId: user.uid,
      userEmail: user.email,
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || "Medium",
    });
    const savedTask = await task.save();
    return normalizeTask(savedTask);
  },
  updateTask: async (
    { id, title, description, dueDate, priority },
    context,
  ) => {
    const user = await getUserFromContext(context);
    const filter = { _id: id, ...getOwnershipFilter(user) };
    const updatedTask = await Task.findOneAndUpdate(
      filter,
      {
        title,
        description,
        dueDate: dueDate || null,
        priority: priority || "Medium",
      },
      { new: true },
    );
    return normalizeTask(updatedTask);
  },
  deleteTask: async ({ id }, context) => {
    const user = await getUserFromContext(context);
    const filter = { _id: id, ...getOwnershipFilter(user) };
    const deletedTask = await Task.findOneAndDelete(filter);
    return "Task deleted successfully";
  },
  toggleTask: async ({ id }, context) => {
    const user = await getUserFromContext(context);
    const filter = { _id: id, ...getOwnershipFilter(user) };
    const task = await Task.findOne(filter);
    if (!task) {
      throw new Error("Task not found");
    }
    task.completed = !task.completed;
    const savedTask = await task.save();
    return normalizeTask(savedTask);
  },
};

module.exports = resolvers;
