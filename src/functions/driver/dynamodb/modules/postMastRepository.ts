import { IPostMastRepository } from 'chillnn-training-abr';
import { PostMast } from 'chillnn-training-abr/dist/entities/type';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBPostMastRepository extends DynamoDBRepositoryBase<PostMast> implements IPostMastRepository {
    public addPost(input: PostMast): Promise<PostMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ...input,
            },
            ConditionExpression: 'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }
    public async deletePost(postID: string): Promise<PostMast> {
        const current = await this.fetchPostByPostID(postID);
        if (!current) {
            throw new Error('404 resource not exist');
        }
        return this.deleteItem({
            TableName: this.tableName,
            Key: this.getKey(current),
        });
    }
    public fetchPostsByOwnerUserID(userID: string): Promise<PostMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Post#${userID}`,
            },
        });
    }
    public async fetchPostByPostID(postID: string): Promise<PostMast | null> {
        const res = await this.query({
            TableName: this.tableName,
            IndexName: DynamoDBRepositoryBase.UUIDIndexName,
            KeyConditionExpression: '#uuid = :uuid',
            ExpressionAttributeNames: {
                '#uuid': 'uuid',
            },
            ExpressionAttributeValues: {
                ':uuid': postID,
            },
        });
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }

    // ================================================
    // keys
    // ================================================
    protected getPK(postMast: PostMast) {
        return `Post#${postMast.ownerUserID}`;
    }
    protected getSK(postMast: PostMast) {
        return `${postMast.createdAt}#${postMast.postID}`;
    }
    protected getUUID(postMast: PostMast) {
        return `${postMast.postID}`;
    }
}
