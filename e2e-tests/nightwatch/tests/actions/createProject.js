function createProject() {
  const projectName = `Happy project${Math.floor(Math.random() * 99999999)}` //для создания уникального имени проекта
  return { projectName }
}

module.exports = { createProject }
