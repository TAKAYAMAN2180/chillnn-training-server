import {DynamoDBRepositoryBase} from "../dynamoDBRepositoryBase";
import {CommentMast, ICommentMastRepository} from "chillnn-training-abr";

export class DynamoDBCommentMastRepository extends DynamoDBRepositoryBase<CommentMast> implements ICommentMastRepository{
    // interfaceの実装
    public addComment(input: CommentMast): Promise<CommentMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ...input
            },
            ConditionExpression: 'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        })
    }

    public fetchCommentsByPostID(postID: string): Promise<CommentMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Comment#${postID}`,
            },
        });
    }

    // ================================================
    // keys
    // ================================================
    protected getPK(commentMast: CommentMast) {
        return `Comment#${commentMast.postID}`;
    }
    protected getSK(commentMast: CommentMast) {
        return `${commentMast.createdAt}#${commentMast.commentID}`;
    }
    protected getUUID(commentMast: CommentMast) {
        return `${commentMast.commentID}`;
    }
}