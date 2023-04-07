class CourseSelectionView {
  constructor() {
    this.selectionForm = document.querySelector(".course-selection__form");
    this.availableCourseList = document.querySelector(".course__list--available");
    this.selectedCourseList = document.querySelector(".course__list--selected");
  }

  renderCourseLists(courseList) {
    this.availableCourseList.innerText = "";
    console.log("available course list", courseList);
    courseList.forEach((course) => {
      const courseItem = this.createCourseElement(course);
      if (course.selected) {
        this.selectedCourseList.appendChild(courseItem);
      } else {
        courseItem.addEventListener('click', () => {
          courseItem.classList.toggle('course__item--selected');
        })
        this.availableCourseList.appendChild(courseItem);
      }
    })
  }

  appendCourse(newCourse) {
    const newItem = this.createCourseElement(newCourse);
    this.selectedCourseList.appendChild(newItem);
  }

  removeCourse(id) {
    console.log(this.availableCourseList);
    const courses = this.availableCourseList.children;
    console.log(courses);
    for (let i = 0; i < courses.length; i++) {
      const element = courses[i];
      console.log('!!!',element);
      const courseId = element.getAttribute('courseId');
      if (courseId === id) {
        element.remove();
        return;
      }
    }
  }

  createCourseElement(newCourse) {
    const courseElem = document.createElement("div");
    courseElem.classList.add("course__item");
    courseElem.setAttribute('courseId', newCourse.courseId);
    const courseName = document.createElement("div");
    courseName.innerText = newCourse.courseName;
    const courseType = document.createElement("div");
    courseElem.classList.add(`course__item--${newCourse.required ? "Compulsory" : "Elective"}`);
    courseType.innerText = `Course Type: ${newCourse.required ? "Compulsory" : "Elective"}`;
    const courseCredit = document.createElement("div");
    courseCredit.innerText = `Course Credit: ${newCourse.credit}`;
    courseElem.appendChild(courseName);
    courseElem.appendChild(courseType);
    courseElem.appendChild(courseCredit);

    return courseElem;
  }
}

class CourseSelectionModel {
  #courseList;
  #selectedCourseList;
  constructor() {
    this.#courseList = [];
    this.#selectedCourseList = [];
  }

  async fetchCourseList() {
    const courseList = await API.getCourseList();
    this.courseList = courseList;
    return courseList;
  }

  async selectCourse(id) {
    const originalCourse = await await API.getCourse(id);
    const updatedCourse = await API.updateCourse(id, { ...originalCourse, selected: true });
    this.#selectedCourseList.push(updatedCourse);
    return updatedCourse;
  }
}

class CourseSelectionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.model.fetchCourseList().then(() => {
      const courseList = this.model.courseList;
      this.view.renderCourseLists(courseList);
    });

    this.setUpSubmit();
  }

  setUpSubmit() {
    console.log('!')
    this.view.selectionForm.addEventListener('submit', (e) => {
      console.log('!!')
      e.preventDefault();
      const selectedCourses = document.querySelectorAll(".course__item--selected");
      console.log(selectedCourses);
      selectedCourses.forEach(course => {
        this.model.selectCourse(course.getAttribute('courseId')).then(newCourse => {
          this.view.appendCourse(newCourse);
          this.view.removeCourse(course.getAttribute('courseId'));
          console.log(newCourse);
        })
      })
    })
  }
}

// create instances of classes
const app = new CourseSelectionController(new CourseSelectionModel(), new CourseSelectionView());
