import React from 'react';

/**
 * FeedbackButton component - Fixed position button in bottom right corner
 * Opens feedback form in a new tab
 */
export default function FeedbackButton() {
    const feedbackUrl = 'https://form.asana.com/?k=tH5GL9JKLM1TasyZUoeGgw&d=6325821815997';

    return (
        <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-12 right-10 z-50 rounded-full bg-[#F79222] px-4 py-2 text-white shadow-lg transition-all hover:bg-[#e67c00] hover:shadow-xl"
            aria-label="Provide feedback"
        >
            <span className="text-sm font-medium">Feedback</span>
        </a>
    );
}

