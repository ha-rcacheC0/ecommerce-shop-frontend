import {
	getAllShowsQueryOptions,
	getAllShowTypesQueryOptions,
} from "@api/shows/showsQueries";
import { ShowCard } from "@components/show-card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ShowType } from "@/types";

export const Route = createFileRoute("/shows/")({
	component: ShowsList,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(getAllShowsQueryOptions());
		queryClient.ensureQueryData(getAllShowTypesQueryOptions());
	},
});

function ShowsList() {
	const [selectedType, setSelectedType] = useState<string | null>(null);

	const { data: shows, isLoading: showsLoading } = useQuery(
		getAllShowsQueryOptions(),
	);
	const { data: showTypes, isLoading: typesLoading } = useQuery(
		getAllShowTypesQueryOptions(),
	);

	if (showsLoading || typesLoading) {
		return <div className="flex justify-center p-8">Loading shows...</div>;
	}

	const filteredShows = selectedType
		? shows?.shows.filter((show) => show.showTypeId === selectedType)
		: shows?.shows;

	const showTypesDisplay = {
		all: "All Shows",
		CUSTOM: "Custom Shows",
		FOURTH_JULY: "Fourth of July",
		NEW_YEARS: "New Year",
		GENDER_REVEAL: "Gender Reveal",
		RETAIL: "Retail",
		WHOLESALE: "Wholesale",
		WEDDING: "Wedding",
	} as const;

	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Fireworks Shows</h1>

			<div className="flex justify-center mb-6">
				<div className="btn-group">
					<button
						className={`btn ${!selectedType ? "btn-active" : ""}`}
						onClick={() => setSelectedType(null)}
					>
						All Shows
					</button>

					{showTypes.map((type: ShowType) => (
						<button
							key={type.id}
							className={`btn ${selectedType === type.id ? "btn-active" : ""}`}
							onClick={() => setSelectedType(type.id)}
						>
							{showTypesDisplay[type.name as keyof typeof showTypesDisplay] ||
								type.name}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredShows?.map((show) => (
					<ShowCard key={show.id} show={show} />
				))}
			</div>
		</div>
	);
}
