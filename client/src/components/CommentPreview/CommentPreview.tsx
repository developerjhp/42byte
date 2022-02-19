import { Link } from 'react-router-dom';
import { CommentData } from 'pages/Mypage/Mypage';
import { CommentPreviewContainer, CommentWrap, OriginalPost } from './styled';

type GreetingProps = {
	commentData: CommentData;
}

function CommentPreview({ commentData }: GreetingProps) {
	const { id, boardId, postId, authorId, content, commentCnt, likeCnt, blameCnt, isAuthor, isDel, title, createdDate, modifiedDate } = commentData;
	const fullday = new Date();
	const year = `${fullday.getFullYear()}`;
	const month = fullday.getMonth() + 1 < 10 ? `0${fullday.getMonth() + 1}` : `${fullday.getMonth() + 1}`;
	const date = `${fullday.getDate()}`;
	const today = year + '-' + month + '-' + date;

	return (
		<>
			<Link to={`/detail?boardId=1&postId=${postId}`}> 
				<CommentPreviewContainer>
					<CommentWrap>
						<div>{content.length >= 20 ? `${content.slice(0, 20)} ...` : content}</div>
						<div>{createdDate.slice(0,10)}</div>
					</CommentWrap>
					<OriginalPost>
						<h3>{title}</h3>
						<div>[{commentCnt}]</div>
					</OriginalPost>
				</CommentPreviewContainer>
			</Link>
		</>
	);
}

export default CommentPreview;