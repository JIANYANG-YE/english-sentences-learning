import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export type { 
  User, 
  Course, 
  Lesson, 
  Section, 
  Account, 
  Session, 
  LearningPath, 
  LearningData,
  UserProfile,
  Membership,
  CoursePackage,
  Sentence,
  UserCourse,
  UserCourseAccess,
  UserLearningProgress
} from '@prisma/client'; 