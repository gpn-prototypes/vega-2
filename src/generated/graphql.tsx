import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  DictType: any;
  UUID: any;
};

export type Activity = {
  __typename?: 'Activity';
  category?: Maybe<ActivityLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ActivityLibraryCategory = {
  __typename?: 'ActivityLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ActivityLibraryCategory>;
};

export type AddAttendees = {
  __typename?: 'AddAttendees';
  result?: Maybe<Array<Maybe<AttendeeOrError>>>;
};

export type Assembly = {
  __typename?: 'Assembly';
  category?: Maybe<AssemblyLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type AssemblyLibraryCategory = {
  __typename?: 'AssemblyLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<AssemblyLibraryCategory>;
};

export type Attachment = {
  __typename?: 'Attachment';
  extension?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  createdBy?: Maybe<User>;
  editedBy?: Maybe<User>;
  comment?: Maybe<Scalars['String']>;
  category?: Maybe<AttachmentType>;
  contentType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  projectId?: Maybe<Scalars['ID']>;
  size?: Maybe<Scalars['Int']>;
};

export type AttachmentType = {
  __typename?: 'AttachmentType';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type Attendee = {
  __typename?: 'Attendee';
  user?: Maybe<User>;
  roles?: Maybe<Array<Maybe<ProjectRole>>>;
};

export type AttendeeInputType = {
  user: Scalars['UUID'];
  roles: Array<Maybe<Scalars['UUID']>>;
};

export type AttendeeList = {
  __typename?: 'AttendeeList';
  attendeeList?: Maybe<Array<Maybe<Attendee>>>;
};

export type AttendeeListOrError = AttendeeList | Error;

export type AttendeeOrError = Attendee | Error;

export type Autoexport = {
  __typename?: 'Autoexport';
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  yearEnd?: Maybe<Scalars['Int']>;
  expenses?: Maybe<Array<Maybe<OpexExpense>>>;
};

export type AverageAnnualPrice = {
  __typename?: 'AverageAnnualPrice';
  year?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
};

export type Calculation = {
  __typename?: 'Calculation';
  key?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Capex = {
  __typename?: 'Capex';
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  groups?: Maybe<Array<Maybe<CapexExpenseGroup>>>;
  globalValues?: Maybe<Array<Maybe<CapexGlobalValue>>>;
  initCalcDict?: Maybe<Array<Maybe<Calculation>>>;
};

export type CapexExpense = {
  __typename?: 'CapexExpense';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  value?: Maybe<YearValue>;
};

export type CapexExpenseGroup = {
  __typename?: 'CapexExpenseGroup';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  expenses?: Maybe<Array<Maybe<CapexExpense>>>;
};

export type CapexGlobalValue = {
  __typename?: 'CapexGlobalValue';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  value?: Maybe<SingleValue>;
};

export type Component = {
  __typename?: 'Component';
  category?: Maybe<ComponentLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ComponentLibraryCategory = {
  __typename?: 'ComponentLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ComponentLibraryCategory>;
};

export type CoordinateSystem = {
  __typename?: 'CoordinateSystem';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
};

export type Country = {
  __typename?: 'Country';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type CreateActivity = {
  __typename?: 'CreateActivity';
  result?: Maybe<Activity>;
};

export type CreateActivityCategories = {
  __typename?: 'CreateActivityCategories';
  result?: Maybe<ActivityLibraryCategory>;
};

export type CreateAssembly = {
  __typename?: 'CreateAssembly';
  result?: Maybe<Assembly>;
};

export type CreateAssemblyCategories = {
  __typename?: 'CreateAssemblyCategories';
  result?: Maybe<AssemblyLibraryCategory>;
};

export type CreateAttachment = {
  __typename?: 'CreateAttachment';
  result?: Maybe<Attachment>;
};

export type CreateAttachmentType = {
  __typename?: 'CreateAttachmentType';
  result?: Maybe<AttachmentType>;
};

export type CreateComponent = {
  __typename?: 'CreateComponent';
  result?: Maybe<Component>;
};

export type CreateComponentCategories = {
  __typename?: 'CreateComponentCategories';
  result?: Maybe<ComponentLibraryCategory>;
};

export type CreateCoordinateSystem = {
  __typename?: 'CreateCoordinateSystem';
  result?: Maybe<CoordinateSystem>;
};

export type CreateCountry = {
  __typename?: 'CreateCountry';
  result?: Maybe<Country>;
};

export type CreateDomain = {
  __typename?: 'CreateDomain';
  result?: Maybe<Domain>;
};

export type CreateDomainCategories = {
  __typename?: 'CreateDomainCategories';
  result?: Maybe<DomainLibraryCategory>;
};

export type CreateDomainEntity = {
  __typename?: 'CreateDomainEntity';
  result?: Maybe<DomainEntity>;
};

export type CreateDomainTemplate = {
  __typename?: 'CreateDomainTemplate';
  result?: Maybe<DomainTemplate>;
};

export type CreateDomainTemplateCategories = {
  __typename?: 'CreateDomainTemplateCategories';
  result?: Maybe<DomainLibraryCategory>;
};

export type CreateOrganization = {
  __typename?: 'CreateOrganization';
  result?: Maybe<Organization>;
};

export type CreateProject = {
  __typename?: 'CreateProject';
  result?: Maybe<ProjectOrError>;
};

export type CreateProjectFile = {
  __typename?: 'CreateProjectFile';
  result?: Maybe<ProjectFile>;
};

export type CreateProjectLibrary = {
  __typename?: 'CreateProjectLibrary';
  result?: Maybe<ProjectLibrary>;
};

export type CreateProjectLibraryCategories = {
  __typename?: 'CreateProjectLibraryCategories';
  result?: Maybe<ProjectLibraryCategory>;
};

export type CreateProjectRole = {
  __typename?: 'CreateProjectRole';
  result?: Maybe<ProjectRole>;
};

export type CreateRegion = {
  __typename?: 'CreateRegion';
  result?: Maybe<Region>;
};

export type CreateUser = {
  __typename?: 'CreateUser';
  result?: Maybe<User>;
};

export type CreateUserGroup = {
  __typename?: 'CreateUserGroup';
  result?: Maybe<UserGroup>;
};

export type DeleteActivity = {
  __typename?: 'DeleteActivity';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteActivityCategories = {
  __typename?: 'DeleteActivityCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteAssembly = {
  __typename?: 'DeleteAssembly';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteAssemblyCategories = {
  __typename?: 'DeleteAssemblyCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteAttachment = {
  __typename?: 'DeleteAttachment';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteAttachmentType = {
  __typename?: 'DeleteAttachmentType';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteComponent = {
  __typename?: 'DeleteComponent';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteComponentCategories = {
  __typename?: 'DeleteComponentCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteCoordinateSystem = {
  __typename?: 'DeleteCoordinateSystem';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteCountry = {
  __typename?: 'DeleteCountry';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteDomain = {
  __typename?: 'DeleteDomain';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteDomainCategories = {
  __typename?: 'DeleteDomainCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteDomainEntity = {
  __typename?: 'DeleteDomainEntity';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteDomainTemplate = {
  __typename?: 'DeleteDomainTemplate';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteDomainTemplateCategories = {
  __typename?: 'DeleteDomainTemplateCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteOrganization = {
  __typename?: 'DeleteOrganization';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteProject = {
  __typename?: 'DeleteProject';
  result?: Maybe<UuidOrError>;
};

export type DeleteProjectFile = {
  __typename?: 'DeleteProjectFile';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteProjectLibrary = {
  __typename?: 'DeleteProjectLibrary';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteProjectLibraryCategories = {
  __typename?: 'DeleteProjectLibraryCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteProjectRole = {
  __typename?: 'DeleteProjectRole';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteRegion = {
  __typename?: 'DeleteRegion';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteUser = {
  __typename?: 'DeleteUser';
  result?: Maybe<Scalars['Boolean']>;
};

export type DeleteUserGroup = {
  __typename?: 'DeleteUserGroup';
  result?: Maybe<Scalars['Boolean']>;
};

export type Domain = {
  __typename?: 'Domain';
  category?: Maybe<DomainLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type DomainEntity = {
  __typename?: 'DomainEntity';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type DomainEntityImage = {
  __typename?: 'DomainEntityImage';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<DomainEntity>;
  attributes?: Maybe<Array<Maybe<PropertyMeta>>>;
  description?: Maybe<Scalars['String']>;
};

export type DomainLibraryCategory = {
  __typename?: 'DomainLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<DomainLibraryCategory>;
};

export type DomainSchema = {
  __typename?: 'DomainSchema';
  entityImages?: Maybe<Array<Maybe<DomainEntityImage>>>;
  version?: Maybe<Scalars['String']>;
};

export type DomainTemplate = {
  __typename?: 'DomainTemplate';
  category?: Maybe<DomainLibraryCategory>;
  entity?: Maybe<DomainEntity>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<PropertyMeta>>>;
};

export type Error = ErrorInterface & {
  __typename?: 'Error';
  code: ErrorCodes;
  message: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['DictType']>;
};

export enum ErrorCodes {
  ProjectNotFound = 'PROJECT_NOT_FOUND',
  ProjectAlreadyRemoved = 'PROJECT_ALREADY_REMOVED',
  ProjectUpdateError = 'PROJECT_UPDATE_ERROR',
  ReferenceItemNotFound = 'REFERENCE_ITEM_NOT_FOUND',
  Error = 'ERROR',
  IncorrectProjectVersion = 'INCORRECT_PROJECT_VERSION',
  ProjectVersionDiffError = 'PROJECT_VERSION_DIFF_ERROR',
}

export type ErrorInterface = {
  code: ErrorCodes;
  message: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['DictType']>;
};

export type Macroparameter = {
  __typename?: 'Macroparameter';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  years?: Maybe<Scalars['Int']>;
  yearStart?: Maybe<Scalars['Int']>;
  value?: Maybe<YearValue>;
};

export type MacroparameterGroup = {
  __typename?: 'MacroparameterGroup';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  years?: Maybe<Scalars['Int']>;
  yearStart?: Maybe<Scalars['Int']>;
  parameters?: Maybe<Array<Maybe<Macroparameter>>>;
};

export type MacroparameterSet = {
  __typename?: 'MacroparameterSet';
  Id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  years?: Maybe<Scalars['Int']>;
  yearStart?: Maybe<Scalars['Int']>;
  category?: Maybe<Scalars['Int']>;
  groups?: Maybe<Array<Maybe<MacroparameterGroup>>>;
};

export type Mkos = {
  __typename?: 'Mkos';
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  yearEnd?: Maybe<Scalars['Int']>;
  expenses?: Maybe<Array<Maybe<OpexExpense>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProjectLibrary?: Maybe<CreateProjectLibrary>;
  deleteProjectLibrary?: Maybe<DeleteProjectLibrary>;
  updateProjectLibrary?: Maybe<UpdateProjectLibrary>;
  createProjectLibraryCategories?: Maybe<CreateProjectLibraryCategories>;
  deleteProjectLibraryCategories?: Maybe<DeleteProjectLibraryCategories>;
  updateProjectLibraryCategories?: Maybe<UpdateProjectLibraryCategories>;
  createDomain?: Maybe<CreateDomain>;
  deleteDomain?: Maybe<DeleteDomain>;
  updateDomain?: Maybe<UpdateDomain>;
  createDomainCategories?: Maybe<CreateDomainCategories>;
  deleteDomainCategories?: Maybe<DeleteDomainCategories>;
  updateDomainCategories?: Maybe<UpdateDomainCategories>;
  createComponent?: Maybe<CreateComponent>;
  deleteComponent?: Maybe<DeleteComponent>;
  updateComponent?: Maybe<UpdateComponent>;
  createComponentCategories?: Maybe<CreateComponentCategories>;
  deleteComponentCategories?: Maybe<DeleteComponentCategories>;
  updateComponentCategories?: Maybe<UpdateComponentCategories>;
  createAssembly?: Maybe<CreateAssembly>;
  deleteAssembly?: Maybe<DeleteAssembly>;
  updateAssembly?: Maybe<UpdateAssembly>;
  createAssemblyCategories?: Maybe<CreateAssemblyCategories>;
  deleteAssemblyCategories?: Maybe<DeleteAssemblyCategories>;
  updateAssemblyCategories?: Maybe<UpdateAssemblyCategories>;
  createActivity?: Maybe<CreateActivity>;
  deleteActivity?: Maybe<DeleteActivity>;
  updateActivity?: Maybe<UpdateActivity>;
  createActivityCategories?: Maybe<CreateActivityCategories>;
  deleteActivityCategories?: Maybe<DeleteActivityCategories>;
  updateActivityCategories?: Maybe<UpdateActivityCategories>;
  createDomainTemplate?: Maybe<CreateDomainTemplate>;
  deleteDomainTemplate?: Maybe<DeleteDomainTemplate>;
  updateDomainTemplate?: Maybe<UpdateDomainTemplate>;
  createDomainTemplateCategories?: Maybe<CreateDomainTemplateCategories>;
  deleteDomainTemplateCategories?: Maybe<DeleteDomainTemplateCategories>;
  updateDomainTemplateCategories?: Maybe<UpdateDomainTemplateCategories>;
  createUser?: Maybe<CreateUser>;
  deleteUser?: Maybe<DeleteUser>;
  updateUser?: Maybe<UpdateUser>;
  createProjectRole?: Maybe<CreateProjectRole>;
  deleteProjectRole?: Maybe<DeleteProjectRole>;
  updateProjectRole?: Maybe<UpdateProjectRole>;
  createAttachmentType?: Maybe<CreateAttachmentType>;
  deleteAttachmentType?: Maybe<DeleteAttachmentType>;
  updateAttachmentType?: Maybe<UpdateAttachmentType>;
  createUserGroup?: Maybe<CreateUserGroup>;
  deleteUserGroup?: Maybe<DeleteUserGroup>;
  updateUserGroup?: Maybe<UpdateUserGroup>;
  createOrganization?: Maybe<CreateOrganization>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  updateOrganization?: Maybe<UpdateOrganization>;
  createCountry?: Maybe<CreateCountry>;
  deleteCountry?: Maybe<DeleteCountry>;
  updateCountry?: Maybe<UpdateCountry>;
  createRegion?: Maybe<CreateRegion>;
  deleteRegion?: Maybe<DeleteRegion>;
  updateRegion?: Maybe<UpdateRegion>;
  createCoordinateSystem?: Maybe<CreateCoordinateSystem>;
  deleteCoordinateSystem?: Maybe<DeleteCoordinateSystem>;
  updateCoordinateSystem?: Maybe<UpdateCoordinateSystem>;
  createAttachment?: Maybe<CreateAttachment>;
  deleteAttachment?: Maybe<DeleteAttachment>;
  updateAttachment?: Maybe<UpdateAttachment>;
  createProjectFile?: Maybe<CreateProjectFile>;
  deleteProjectFile?: Maybe<DeleteProjectFile>;
  updateProjectFile?: Maybe<UpdateProjectFile>;
  createDomainEntity?: Maybe<CreateDomainEntity>;
  deleteDomainEntity?: Maybe<DeleteDomainEntity>;
  updateDomainEntity?: Maybe<UpdateDomainEntity>;
  createProject?: Maybe<CreateProject>;
  deleteProject?: Maybe<DeleteProject>;
  updateProject?: Maybe<UpdateProject>;
  addAttendees?: Maybe<AddAttendees>;
  removeAttendees?: Maybe<RemoveAttendees>;
};

export type MutationCreateProjectLibraryArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectLibraryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectLibraryArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectLibraryCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectLibraryCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectLibraryCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateComponentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteComponentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateComponentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateComponentCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteComponentCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateComponentCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAssemblyArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAssemblyArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAssemblyArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAssemblyCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAssemblyCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAssemblyCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateActivityArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteActivityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateActivityArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateActivityCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteActivityCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateActivityCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainTemplateArgs = {
  attributes?: Maybe<Array<Maybe<PropertyMetaInputType>>>;
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  entity?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainTemplateArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainTemplateArgs = {
  attributes?: Maybe<Array<Maybe<PropertyMetaInputType>>>;
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  entity?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainTemplateCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainTemplateCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainTemplateCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateUserArgs = {
  adId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  firstName?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteUserArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateUserArgs = {
  adId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  firstName?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectRoleArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  defaultAttachmentType?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectRoleArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectRoleArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  defaultAttachmentType?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAttachmentTypeArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAttachmentTypeArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAttachmentTypeArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateUserGroupArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteUserGroupArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateUserGroupArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateOrganizationArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteOrganizationArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateOrganizationArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateCountryArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteCountryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateCountryArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateRegionArgs = {
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['UUID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  fullName?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteRegionArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateRegionArgs = {
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['UUID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  fullName?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateCoordinateSystemArgs = {
  code?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteCoordinateSystemArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateCoordinateSystemArgs = {
  code?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAttachmentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  editedBy?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['UUID']>;
  size?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAttachmentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAttachmentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  editedBy?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['UUID']>;
  size?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectFileArgs = {
  category?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  extension?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectFileArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectFileArgs = {
  category?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  extension?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainEntityArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainEntityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainEntityArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectArgs = {
  data?: Maybe<ProjectInputType>;
};

export type MutationDeleteProjectArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectArgs = {
  data?: Maybe<ProjectUpdateType>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationAddAttendeesArgs = {
  attendees: Array<Maybe<AttendeeInputType>>;
  projectId: Scalars['UUID'];
};

export type MutationRemoveAttendeesArgs = {
  attendees: Array<Maybe<Scalars['UUID']>>;
  projectId: Scalars['UUID'];
};

export type NetbackPrice = {
  __typename?: 'NetbackPrice';
  name?: Maybe<Scalars['String']>;
  prices?: Maybe<Array<Maybe<AverageAnnualPrice>>>;
  netbackType?: Maybe<Scalars['String']>;
  units?: Maybe<Scalars['String']>;
};

export type Opex = {
  __typename?: 'Opex';
  autoexport?: Maybe<Autoexport>;
  mkos?: Maybe<Mkos>;
  cases?: Maybe<Array<Maybe<OpexCase>>>;
  values?: Maybe<Array<Maybe<Scalars['Int']>>>;
  initDict?: Maybe<YearValue>;
};

export type OpexCase = {
  __typename?: 'OpexCase';
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  yearEnd?: Maybe<Scalars['Int']>;
  expenses?: Maybe<Array<Maybe<OpexExpense>>>;
};

export type OpexExpense = {
  __typename?: 'OpexExpense';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  value?: Maybe<YearValue>;
};

export type Organization = {
  __typename?: 'Organization';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  name?: Maybe<Scalars['String']>;
  prices?: Maybe<Array<Maybe<AverageAnnualPrice>>>;
  units?: Maybe<Scalars['String']>;
};

export type ProductType = {
  __typename?: 'ProductType';
  name?: Maybe<Scalars['String']>;
  netback?: Maybe<NetbackPrice>;
  products?: Maybe<Array<Maybe<Product>>>;
};

export type Project = {
  __typename?: 'Project';
  isFavorite?: Maybe<Scalars['Boolean']>;
  attendeesTotal?: Maybe<Scalars['Int']>;
  filesTotal?: Maybe<Scalars['Int']>;
  files?: Maybe<Array<Maybe<Attachment>>>;
  attendees?: Maybe<Array<Maybe<Attendee>>>;
  yearEnd?: Maybe<Scalars['Int']>;
  domainSchema?: Maybe<DomainSchema>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
  createdBy?: Maybe<User>;
  editedBy?: Maybe<User>;
  authorUnit?: Maybe<Scalars['String']>;
  region?: Maybe<Region>;
  coordinates?: Maybe<Scalars['String']>;
  coordinateSystem?: Maybe<CoordinateSystem>;
  description?: Maybe<Scalars['String']>;
  rootEntity?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  capex?: Maybe<Capex>;
  opex?: Maybe<Opex>;
  macroparameterSets?: Maybe<Array<Maybe<MacroparameterSet>>>;
  scenario?: Maybe<Array<Maybe<Scenario>>>;
  version?: Maybe<Scalars['Int']>;
};

export type ProjectDiffOrError = Project | UpdateProjectDiff | Error;

export type ProjectFile = {
  __typename?: 'ProjectFile';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  extension?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

export type ProjectInputType = {
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['ID']>;
  coordinateSystem?: Maybe<Scalars['ID']>;
  coordinates?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
};

export type ProjectLibrary = {
  __typename?: 'ProjectLibrary';
  category?: Maybe<ProjectLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ProjectLibraryCategory = {
  __typename?: 'ProjectLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ProjectLibraryCategory>;
};

export type ProjectList = {
  __typename?: 'ProjectList';
  projectList?: Maybe<Array<Maybe<Project>>>;
};

export type ProjectListOrError = ProjectList | Error;

export type ProjectOrError = Project | Error;

export type ProjectRole = {
  __typename?: 'ProjectRole';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  defaultAttachmentType?: Maybe<AttachmentType>;
};

export enum ProjectStatus {
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Paused = 'PAUSED',
  Removed = 'REMOVED',
}

export type ProjectUpdateType = {
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['ID']>;
  coordinateSystem?: Maybe<Scalars['ID']>;
  coordinates?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  status: ProjectStatus;
  isFavorite?: Maybe<Scalars['Boolean']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  version: Scalars['Int'];
};

export type PropertyMeta = {
  __typename?: 'PropertyMeta';
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<DomainEntity>;
  attrType?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  validationRules?: Maybe<ValidationRules>;
  description?: Maybe<Scalars['String']>;
};

export type PropertyMetaInputType = {
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['UUID']>;
  attrType?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  validationRules?: Maybe<ValidationRulesInputType>;
  description?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  projectLibrarylist?: Maybe<Array<Maybe<ProjectLibrary>>>;
  projectLibrary?: Maybe<ProjectLibrary>;
  projectLibraryCategoriesList?: Maybe<Array<Maybe<ProjectLibraryCategory>>>;
  projectLibraryCategories?: Maybe<ProjectLibraryCategory>;
  domainList?: Maybe<Array<Maybe<Domain>>>;
  domain?: Maybe<Domain>;
  domainCategoriesList?: Maybe<Array<Maybe<DomainLibraryCategory>>>;
  domainCategories?: Maybe<DomainLibraryCategory>;
  componentList?: Maybe<Array<Maybe<Component>>>;
  component?: Maybe<Component>;
  componentCategoriesList?: Maybe<Array<Maybe<ComponentLibraryCategory>>>;
  componentCategories?: Maybe<ComponentLibraryCategory>;
  assemblyList?: Maybe<Array<Maybe<Assembly>>>;
  assembly?: Maybe<Assembly>;
  assemblyCategoriesList?: Maybe<Array<Maybe<AssemblyLibraryCategory>>>;
  assemblyCategories?: Maybe<AssemblyLibraryCategory>;
  activityList?: Maybe<Array<Maybe<Activity>>>;
  activity?: Maybe<Activity>;
  activityCategoriesList?: Maybe<Array<Maybe<ActivityLibraryCategory>>>;
  activityCategories?: Maybe<ActivityLibraryCategory>;
  domainTemplatelist?: Maybe<Array<Maybe<DomainTemplate>>>;
  domainTemplate?: Maybe<DomainTemplate>;
  domainTemplateCategoriesList?: Maybe<Array<Maybe<DomainLibraryCategory>>>;
  domainTemplateCategories?: Maybe<DomainLibraryCategory>;
  userList?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  projectRoleList?: Maybe<Array<Maybe<ProjectRole>>>;
  projectRole?: Maybe<ProjectRole>;
  attachmentTypeList?: Maybe<Array<Maybe<AttachmentType>>>;
  attachmentType?: Maybe<AttachmentType>;
  userGroupList?: Maybe<Array<Maybe<UserGroup>>>;
  userGroup?: Maybe<UserGroup>;
  organizationList?: Maybe<Array<Maybe<Organization>>>;
  organization?: Maybe<Organization>;
  countryList?: Maybe<Array<Maybe<Country>>>;
  country?: Maybe<Country>;
  regionList?: Maybe<Array<Maybe<Region>>>;
  region?: Maybe<Region>;
  coordinateSystemList?: Maybe<Array<Maybe<CoordinateSystem>>>;
  coordinateSystem?: Maybe<CoordinateSystem>;
  attachmentList?: Maybe<Array<Maybe<Attachment>>>;
  attachment?: Maybe<Attachment>;
  projectFileList?: Maybe<Array<Maybe<ProjectFile>>>;
  projectFile?: Maybe<ProjectFile>;
  domainEntityList?: Maybe<Array<Maybe<DomainEntity>>>;
  domainEntity?: Maybe<DomainEntity>;
  project?: Maybe<ProjectOrError>;
  projectList?: Maybe<ProjectListOrError>;
  me?: Maybe<User>;
};

export type QueryProjectLibraryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectLibraryCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryComponentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryComponentCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAssemblyArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAssemblyCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryActivityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryActivityCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainTemplateArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainTemplateCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryUserArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectRoleArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAttachmentTypeArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryUserGroupArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryOrganizationArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryCountryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryRegionArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryCoordinateSystemArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAttachmentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectFileArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainEntityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectArgs = {
  vid?: Maybe<Scalars['UUID']>;
  version?: Maybe<Scalars['Int']>;
};

export type Region = {
  __typename?: 'Region';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
};

export type RemoveAttendees = {
  __typename?: 'RemoveAttendees';
  result?: Maybe<AttendeeListOrError>;
};

export type Result = {
  __typename?: 'Result';
  vid?: Maybe<Scalars['UUID']>;
};

export type Scenario = {
  __typename?: 'Scenario';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['Float']>;
  productTypes?: Maybe<Array<Maybe<ProductType>>>;
};

export type SingleValue = {
  __typename?: 'SingleValue';
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type UpdateActivity = {
  __typename?: 'UpdateActivity';
  result?: Maybe<Activity>;
};

export type UpdateActivityCategories = {
  __typename?: 'UpdateActivityCategories';
  result?: Maybe<Activity>;
};

export type UpdateAssembly = {
  __typename?: 'UpdateAssembly';
  result?: Maybe<Assembly>;
};

export type UpdateAssemblyCategories = {
  __typename?: 'UpdateAssemblyCategories';
  result?: Maybe<Assembly>;
};

export type UpdateAttachment = {
  __typename?: 'UpdateAttachment';
  result?: Maybe<Attachment>;
};

export type UpdateAttachmentType = {
  __typename?: 'UpdateAttachmentType';
  result?: Maybe<AttachmentType>;
};

export type UpdateComponent = {
  __typename?: 'UpdateComponent';
  result?: Maybe<Component>;
};

export type UpdateComponentCategories = {
  __typename?: 'UpdateComponentCategories';
  result?: Maybe<Component>;
};

export type UpdateCoordinateSystem = {
  __typename?: 'UpdateCoordinateSystem';
  result?: Maybe<CoordinateSystem>;
};

export type UpdateCountry = {
  __typename?: 'UpdateCountry';
  result?: Maybe<Country>;
};

export type UpdateDomain = {
  __typename?: 'UpdateDomain';
  result?: Maybe<Domain>;
};

export type UpdateDomainCategories = {
  __typename?: 'UpdateDomainCategories';
  result?: Maybe<Domain>;
};

export type UpdateDomainEntity = {
  __typename?: 'UpdateDomainEntity';
  result?: Maybe<DomainEntity>;
};

export type UpdateDomainTemplate = {
  __typename?: 'UpdateDomainTemplate';
  result?: Maybe<DomainTemplate>;
};

export type UpdateDomainTemplateCategories = {
  __typename?: 'UpdateDomainTemplateCategories';
  result?: Maybe<DomainTemplate>;
};

export type UpdateOrganization = {
  __typename?: 'UpdateOrganization';
  result?: Maybe<Organization>;
};

export type UpdateProject = {
  __typename?: 'UpdateProject';
  result?: Maybe<ProjectDiffOrError>;
};

export type UpdateProjectDiff = {
  __typename?: 'UpdateProjectDiff';
  remoteProject?: Maybe<Project>;
  localProject?: Maybe<Project>;
  message?: Maybe<Scalars['String']>;
};

export type UpdateProjectFile = {
  __typename?: 'UpdateProjectFile';
  result?: Maybe<ProjectFile>;
};

export type UpdateProjectLibrary = {
  __typename?: 'UpdateProjectLibrary';
  result?: Maybe<ProjectLibrary>;
};

export type UpdateProjectLibraryCategories = {
  __typename?: 'UpdateProjectLibraryCategories';
  result?: Maybe<ProjectLibrary>;
};

export type UpdateProjectRole = {
  __typename?: 'UpdateProjectRole';
  result?: Maybe<ProjectRole>;
};

export type UpdateRegion = {
  __typename?: 'UpdateRegion';
  result?: Maybe<Region>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  result?: Maybe<User>;
};

export type UpdateUserGroup = {
  __typename?: 'UpdateUserGroup';
  result?: Maybe<UserGroup>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  login?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  adId?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['ID']>>>;
  groups?: Maybe<Array<Maybe<UserGroup>>>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type UuidOrError = Result | Error;

export type ValidationRules = {
  __typename?: 'ValidationRules';
  rules?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ValidationRulesInputType = {
  rules?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type YearValue = {
  __typename?: 'YearValue';
  type?: Maybe<Scalars['String']>;
};

export type CoordinateSystemsFragment = { __typename?: 'CoordinateSystem' } & Pick<
  CoordinateSystem,
  'name' | 'vid'
>;

export type ProjectDataFragment = { __typename?: 'Project' } & Pick<
  Project,
  'vid' | 'name' | 'editedAt' | 'createdAt'
> & {
    attendees?: Maybe<
      Array<
        Maybe<
          { __typename?: 'Attendee' } & {
            user?: Maybe<{ __typename?: 'User' } & Pick<User, 'role'>>;
            roles?: Maybe<Array<Maybe<{ __typename?: 'ProjectRole' } & Pick<ProjectRole, 'name'>>>>;
          }
        >
      >
    >;
    region?: Maybe<{ __typename?: 'Region' } & Pick<Region, 'name'>>;
    createdBy?: Maybe<{ __typename?: 'User' } & Pick<User, 'name' | 'vid'>>;
  };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['ID']>;
  coordinateSystem?: Maybe<Scalars['ID']>;
}>;

export type CreateProjectMutation = { __typename?: 'Mutation' } & {
  createProject?: Maybe<
    { __typename?: 'CreateProject' } & {
      result?: Maybe<
        | ({ __typename?: 'Project' } & ProjectDataFragment)
        | ({ __typename?: 'Error' } & Pick<Error, 'code' | 'details' | 'payload'>)
      >;
    }
  >;
};

export type GetProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProjectsQuery = { __typename?: 'Query' } & {
  projectList?: Maybe<
    | ({ __typename?: 'ProjectList' } & {
        projectList?: Maybe<Array<Maybe<{ __typename?: 'Project' } & ProjectDataFragment>>>;
      })
    | ({ __typename?: 'Error' } & Pick<Error, 'code' | 'message' | 'details'>)
  >;
};

export type GetProjectCreateDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetProjectCreateDataQuery = { __typename?: 'Query' } & {
  regionList?: Maybe<Array<Maybe<{ __typename?: 'Region' } & RegionsFragment>>>;
  coordinateSystemList?: Maybe<
    Array<Maybe<{ __typename?: 'CoordinateSystem' } & CoordinateSystemsFragment>>
  >;
};

export type RegionsFragment = { __typename?: 'Region' } & Pick<Region, 'name' | 'vid'>;

export const CoordinateSystemsFragmentDoc = gql`
  fragment CoordinateSystems on CoordinateSystem {
    name
    vid
  }
`;
export const ProjectDataFragmentDoc = gql`
  fragment ProjectData on Project {
    vid
    name
    attendees {
      user {
        role
      }
      roles {
        name
      }
    }
    region {
      name
    }
    editedAt
    createdAt
    createdBy {
      name
      vid
    }
  }
`;
export const RegionsFragmentDoc = gql`
  fragment Regions on Region {
    name
    vid
  }
`;
export const CreateProjectDocument = gql`
  mutation CreateProject(
    $name: String!
    $type: String
    $description: String
    $region: ID
    $coordinateSystem: ID
  ) {
    createProject(
      data: {
        name: $name
        region: $region
        type: $type
        description: $description
        coordinateSystem: $coordinateSystem
      }
    ) {
      result {
        ... on Project {
          ...ProjectData
        }
        ... on Error {
          code
          details
          payload
        }
      }
    }
  }
  ${ProjectDataFragmentDoc}
`;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      type: // value for 'type'
 *      description: // value for 'description'
 *      region: // value for 'region'
 *      coordinateSystem: // value for 'coordinateSystem'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>,
) {
  return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(
    CreateProjectDocument,
    baseOptions,
  );
}
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;
export const GetProjectsDocument = gql`
  query GetProjects {
    projectList {
      ... on ProjectList {
        projectList {
          ...ProjectData
        }
      }
      ... on Error {
        code
        message
        details
      }
    }
  }
  ${ProjectDataFragmentDoc}
`;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>,
) {
  return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    baseOptions,
  );
}
export function useGetProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>,
) {
  return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    baseOptions,
  );
}
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<
  GetProjectsQuery,
  GetProjectsQueryVariables
>;
export const GetProjectCreateDataDocument = gql`
  query GetProjectCreateData {
    regionList {
      ...Regions
    }
    coordinateSystemList {
      ...CoordinateSystems
    }
  }
  ${RegionsFragmentDoc}
  ${CoordinateSystemsFragmentDoc}
`;

/**
 * __useGetProjectCreateDataQuery__
 *
 * To run a query within a React component, call `useGetProjectCreateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectCreateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectCreateDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectCreateDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProjectCreateDataQuery,
    GetProjectCreateDataQueryVariables
  >,
) {
  return Apollo.useQuery<GetProjectCreateDataQuery, GetProjectCreateDataQueryVariables>(
    GetProjectCreateDataDocument,
    baseOptions,
  );
}
export function useGetProjectCreateDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProjectCreateDataQuery,
    GetProjectCreateDataQueryVariables
  >,
) {
  return Apollo.useLazyQuery<GetProjectCreateDataQuery, GetProjectCreateDataQueryVariables>(
    GetProjectCreateDataDocument,
    baseOptions,
  );
}
export type GetProjectCreateDataQueryHookResult = ReturnType<typeof useGetProjectCreateDataQuery>;
export type GetProjectCreateDataLazyQueryHookResult = ReturnType<
  typeof useGetProjectCreateDataLazyQuery
>;
export type GetProjectCreateDataQueryResult = Apollo.QueryResult<
  GetProjectCreateDataQuery,
  GetProjectCreateDataQueryVariables
>;
