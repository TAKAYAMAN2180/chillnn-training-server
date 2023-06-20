import {DynamoDBCommentMastRepository} from "@/driver/dynamodb/modules/commentMastRepository";
import {DynamoDBRepositoryBase} from "@/driver/dynamodb/dynamoDBRepositoryBase";

export const commentMastRepository = new DynamoDBCommentMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);