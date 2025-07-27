import { gql } from '@apollo/client';

export const GET_PROFILES = gql`
  query GetProfiles {
    profilesCollection {
      edges {
        node {
          id
          username
          full_name
          avatar_url
          website
          push_token
          updated_at
        }
      }
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: UUID!) {
    deleteFromprofilesCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: UUID!, $updates: profilesUpdateInput!) {
    updateprofilesCollection(filter: { id: { eq: $id } }, set: $updates) {
      records {
        id
        username
        full_name
        avatar_url
        website
        push_token
        updated_at
      }
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($input: profilesInsertInput!) {
    insertIntoprofilesCollection(objects: [$input]) {
      records {
        id
        username
        full_name
        avatar_url
        website
        push_token
        updated_at
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($id: UUID!) {
    profilesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          username
          full_name
          avatar_url
          website
          push_token
          updated_at
        }
      }
    }
  }
`;

export const GET_CURRENT_USER_PROFILE = gql`
  query GetCurrentUserProfile($userId: UUID!) {
    profilesCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          id
          username
          full_name
          avatar_url
          website
          push_token
          updated_at
        }
      }
    }
  }
`;