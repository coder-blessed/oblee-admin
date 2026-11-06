"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { RefreshCw, Star, Trash2 } from "lucide-react";

export default function ModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/moderation");
      setReviews(response.data.reviews || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  async function deleteReview(review) {
    if (!window.confirm("Delete this review? This action cannot be undone.")) {
      return;
    }
    try {
      setActionId(review.id);
      setError("");
      await api.delete(`/admin/moderation/reviews/${review.id}`);
      setReviews((current) => current.filter((item) => item.id !== review.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not delete the review."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <DashboardLayout
      title="Content Moderation"
      subtitle="Review customer feedback and remove content that violates policy"
    >
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0f0f0f]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-white">Reviews</h2>
          <button
            onClick={loadReviews}
            disabled={loading}
            aria-label="Refresh reviews"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              No reviews to moderate
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
                    <span>{review.user?.fullName || "Oblee member"}</span>
                    <span className="inline-flex items-center gap-1 text-amber-400">
                      <Star size={13} fill="currentColor" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{review.comment}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {review.service?.title || review.event?.title || "Unlinked review"}
                    {" · "}
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteReview(review)}
                  disabled={actionId === review.id}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-900/70 px-3 py-2 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {actionId === review.id ? "Deleting..." : "Delete review"}
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
