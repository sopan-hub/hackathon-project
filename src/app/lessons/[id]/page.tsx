// This page is now a directory. Redirecting to the first chapter.
import { redirect } from 'next/navigation';

export default function LessonRedirectPage({ params }: { params: { id: string } }) {
    redirect(`/lessons/${params.id}/0`);
}
