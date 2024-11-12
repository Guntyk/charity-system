const { Sequelize } = require('sequelize');
const { Transaction } = require('../models');
const Project = require('../models/Project');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Transaction,
          attributes: [],
        },
      ],
      attributes: [
        'id',
        'name',
        'organizationID',
        [
          Sequelize.fn(
            'COALESCE',
            Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN "transactionType" = 'deposit' THEN "amount" ELSE 0 END`)),
            0
          ),
          'revenue',
        ],

        [
          Sequelize.fn(
            'COALESCE',
            Sequelize.fn(
              'SUM',
              Sequelize.literal(`CASE WHEN "transactionType" = 'withdrawal' THEN "amount" ELSE 0 END`)
            ),
            0
          ),
          'costs',
        ],
      ],
      group: ['Project.id'],
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error while getting projects:', error);
    res.status(500).json({ message: 'Error while getting projects', error });
  }
};

const createProject = async (req, res) => {
  const { name, organizationID, costs, revenue } = req.body;

  try {
    const newProject = await Project.create({ name, organizationID, costs, revenue });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
};

const deleteProjects = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No projects selected for deletion' });
  }

  try {
    await Project.destroy({
      where: { id: ids },
    });
    res.status(200).json({ message: 'Projects deleted successfully', deletedIds: ids });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting projects', error });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  deleteProjects,
};
