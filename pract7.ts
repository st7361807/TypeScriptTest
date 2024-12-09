enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

enum Semester {
    First = "First",
    Second = "Second",
}

enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
    enrolledStudents: number;
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            id: this.studentIdCounter++,
            ...student,
        };
        this.students.push(newStudent);
        return newStudent;
    }

    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);

        if (!student) throw new Error("Student not found.");
        if (!course) throw new Error("Course not found.");
        if (course.enrolledStudents >= course.maxStudents) {
            throw new Error("Course is full.");
        }
        if (student.faculty !== course.faculty) {
            throw new Error("Student cannot register for a course of a different faculty.");
        }

        course.enrolledStudents++;
    }

    setGrade(studentId: number, courseId: number, grade: GradeValue): void {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) throw new Error("Course not found.");
        if (!this.grades.some((g) => g.studentId === studentId && g.courseId === courseId)) {
            throw new Error("Student is not registered for this course.");
        }

        this.grades.push({
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester,
        });
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) throw new Error("Student not found.");
        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((s) => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter((g) => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(
            (c) => c.faculty === faculty && c.semester === semester && c.enrolledStudents < c.maxStudents
        );
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.grades.filter((g) => g.studentId === studentId);
        if (studentGrades.length === 0) return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsInFaculty = this.getStudentsByFaculty(faculty);
        const topStudents: Student[] = [];

        studentsInFaculty.forEach((student) => {
            const averageGrade = this.calculateAverageGrade(student.id);
            if (averageGrade >= GradeValue.Excellent - 1) {
                topStudents.push(student);
            }
        });

        return topStudents;
    }
}

const ums = new UniversityManagementSystem();

const student = ums.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-101",
});

const course: Course = {
    id: 1,
    name: "Programming 101",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30,
    enrolledStudents: 0,
};

ums.registerForCourse(student.id, course.id);
ums.setGrade(student.id, course.id, GradeValue.Excellent);
console.log(ums.calculateAverageGrade(student.id));
