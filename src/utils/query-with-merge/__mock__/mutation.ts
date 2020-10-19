import { gql } from '@apollo/client';

// : {
//   $name: String
//   $description: String
//   $status: ProjectStatus! = draft
// }

// ... on Error {
//   code
//   errorMessage: message
//   details
//   payload
// }
export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($project: Project) {
    updateProject(project: $project) {
      result {
        project {
          name
          description
          status
          version
        }
      }
    }
  }
`;

// ... on UpdateProjectDiff {
//   message
// }
