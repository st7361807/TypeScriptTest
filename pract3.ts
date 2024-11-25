// Define basic types
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};

// Data arrays
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

// Add a professor
const addProfessor = (professor: Professor): void => {
  professors.push(professor);
};

// Add a lesson with conflict checking
const addLesson = (lesson: Lesson): boolean => {
  if (validateLesson(lesson) === null) {
    schedule.push(lesson);
    return true;
  }
  return false;
};

// Find available classrooms
const findAvailableClassrooms = (timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] => {
  const occupiedRooms = schedule
    .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
    .map(lesson => lesson.classroomNumber);
  return classrooms.map(room => room.number).filter(number => !occupiedRooms.includes(number));
};

// Get a professor's schedule
const getProfessorSchedule = (professorId: number): Lesson[] => {
  return schedule.filter(lesson => lesson.professorId === professorId);
};

// Validate a lesson for conflicts
const validateLesson = (lesson: Lesson): ScheduleConflict | null => {
  const conflict = schedule.find(
    existingLesson =>
      existingLesson.dayOfWeek === lesson.dayOfWeek &&
      existingLesson.timeSlot === lesson.timeSlot &&
      (existingLesson.professorId === lesson.professorId || existingLesson.classroomNumber === lesson.classroomNumber)
  );

  if (!conflict) return null;

  return {
    type: conflict.professorId === lesson.professorId ? "ProfessorConflict" : "ClassroomConflict",
    lessonDetails: conflict,
  };
};

// Calculate classroom utilization
const getClassroomUtilization = (classroomNumber: string): number => {
  const totalSlots = 5 * 5; // 5 days * 5 time slots per day
  const occupiedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
  return (occupiedSlots / totalSlots) * 100;
};

// Get the most popular course type
const getMostPopularCourseType = (): CourseType => {
  const typeCounts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };

  schedule.forEach(lesson => {
    const course = courses.find(course => course.id === lesson.courseId);
    if (course) typeCounts[course.type]++;
  });

  return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0] as CourseType;
};

// Reassign a classroom for a lesson
const reassignClassroom = (lessonId: number, newClassroomNumber: string): boolean => {
  const lesson = schedule.find(lesson => lesson.courseId === lessonId);
  if (!lesson) return false;

  const conflict = validateLesson({ ...lesson, classroomNumber: newClassroomNumber });
  if (conflict) return false;

  lesson.classroomNumber = newClassroomNumber;
  return true;
};

// Cancel a lesson
const cancelLesson = (lessonId: number): void => {
  const index = schedule.findIndex(lesson => lesson.courseId === lessonId);
  if (index !== -1) schedule.splice(index, 1);
};
