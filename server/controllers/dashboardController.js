import Student from '../models/Student.js';
import Department from '../models/Department.js';
import Section from '../models/Section.js';
import User from '../models/User.js';

// Cache for statistics (simple in-memory cache)
let statsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get dashboard statistics
export const getStats = async (req, res) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (statsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            return res.status(200).json({
                success: true,
                data: statsCache,
                cached: true
            });
        }

        // Calculate statistics
        const [totalStudents, totalDepartments, totalSections, totalUsers, totalFaculty] = await Promise.all([
            Student.countDocuments(),
            Department.countDocuments(),
            Section.countDocuments(),
            User.countDocuments(),
            User.countDocuments({ role: 'Faculty' })
        ]);

        // Get department-wise student distribution
        const departmentDistribution = await Student.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            {
                $unwind: '$departmentInfo'
            },
            {
                $project: {
                    _id: 1,
                    departmentName: '$departmentInfo.name',
                    departmentCode: '$departmentInfo.code',
                    studentCount: '$count'
                }
            },
            {
                $sort: { departmentName: 1 }
            }
        ]);

        // Get section-wise student distribution
        const sectionDistribution = await Student.aggregate([
            {
                $group: {
                    _id: '$section',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'sections',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sectionInfo'
                }
            },
            {
                $unwind: '$sectionInfo'
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'sectionInfo.department',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            {
                $unwind: '$departmentInfo'
            },
            {
                $project: {
                    _id: 1,
                    sectionName: '$sectionInfo.name',
                    departmentName: '$departmentInfo.name',
                    capacity: '$sectionInfo.capacity',
                    studentCount: '$count'
                }
            },
            {
                $sort: { departmentName: 1, sectionName: 1 }
            }
        ]);

        const stats = {
            overview: {
                totalStudents,
                totalDepartments,
                totalSections,
                totalUsers,
                totalFaculty
            },
            departmentDistribution,
            sectionDistribution
        };

        // Update cache
        statsCache = stats;
        cacheTimestamp = now;

        res.status(200).json({
            success: true,
            data: stats,
            cached: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving dashboard statistics',
                code: 'FETCH_ERROR',
                details: error.message
            }
        });
    }
};

// Clear statistics cache (can be called after data modifications)
export const clearStatsCache = () => {
    statsCache = null;
    cacheTimestamp = null;
};
