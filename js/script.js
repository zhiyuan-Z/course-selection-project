class CourseSelectionView {
  constructor() {
    this.selectionForm = document.querySelector(".course-selection__form");
    this.availableCourseList = document.querySelector(".course__list--available");
    this.selectedCourseList = document.querySelector(".course__list--selected");
    this.selectedCredit = document.querySelector("#total-credit");
  }

  renderCourseLists(courseList) {
    console.log("available course list", courseList);
    courseList.forEach((course) => {
      const courseItem = this.createCourseElement(course);
      if (course.selected) {
        this.selectedCourseList.appendChild(courseItem);
      } else {
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
    courseElem.setAttribute('credit', newCourse.credit);
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
  selectedCredit;
  constructor() {
    this.#courseList = [];
    this.#selectedCourseList = [];
  }

  async fetchCourseList() {
    const courseList = await API.getCourseList();
    this.courseList = courseList;
    this.#selectedCourseList = courseList.filter(course => course.selected);
    console.log(this.#selectedCourseList);
    return courseList;
  }

  getCredit() {
    this.selectedCredit = this.#selectedCourseList.reduce((total, item) => total + item.credit, 0)
    return this.selectedCredit;
  }

  async selectCourse(id) {
    const originalCourse = await API.getCourse(id);
    const updatedCourse = await API.updateCourse(id, { ...originalCourse, selected: true });
    this.#selectedCourseList.push(updatedCourse);
    console.log('credits', this.getCredit());
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
      this.setUpGetCredit();
    });

    this.setUpSubmit();
  }

  setUpGetCredit() {
    const selectedCredit = this.model.getCredit();
    this.view.selectedCredit.innerText = this.model.selectedCredit;
    const courses = document.querySelectorAll('.course__list--available > .course__item');
    console.log(courses);
    courses.forEach(course => {
      if (course.classList.contains('course__item')) {
        course.addEventListener('click', () => {
          if (course.classList.contains('course__item--selected')) {
            this.model.selectedCredit -= parseInt(course.getAttribute('credit'));
            console.log(this.model.selectedCredit);
            course.classList.remove('course__item--selected');

          } else if (this.model.selectedCredit + parseInt(course.getAttribute('credit')) > 18) {
            alert('You can only choose up to 18 credits in one semester');
          } else {
            this.model.selectedCredit += parseInt(course.getAttribute('credit'));
            console.log(this.model.selectedCredit);
            course.classList.add('course__item--selected');
          }
          this.view.selectedCredit.innerText = this.model.selectedCredit;
        })
      }
    })
  }

  setUpSubmit() {
    this.view.selectionForm.addEventListener('submit', (e) => {
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
