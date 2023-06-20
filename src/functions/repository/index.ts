import { RepositoryContainer } from 'chillnn-training-abr';
import { postMastRepository } from './modules/postMastRepository';
import { s3Repository } from './modules/s3Repository';
import { userMastRepository } from './modules/userMastRepository';
import {commentMastRepository} from "@/repository/modules/commentMastRepository";

export const repositoryContainer = new RepositoryContainer(
    // infra
    s3Repository,
    // resources
    postMastRepository,
    userMastRepository,
    commentMastRepository
);
