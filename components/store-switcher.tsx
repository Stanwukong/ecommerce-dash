"use client"

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
	items: Store[];
}

const StoreSwitcher = ({
	className,
	items = []
}: StoreSwitcherProps) => {

	const storeModal = useStoreModal();
	const params = useParams();
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const formattedStores = items.map((item) => ({
		label: item.name,
		value: item.id
	}));

	const currentStore = formattedStores.find((item) => item.value === params.storeId);

	const handleSelect = (store: { value: string, label: string }) => {
		setIsOpen(false);
		router.push(`/${store.value}/settings`);
	}

	return ( 
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant={"outline"} size={"sm"} role="combobox" aria-expanded={isOpen} aria-label="Pick a store"
					className={cn("w-[200px] justify-between", className)}
				>
					<StoreIcon className="mr-2 h-4 w-4" />
					{currentStore?.label || "Select a store"}
					<ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 shrink-0"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search store..."/>
						<CommandEmpty>No store found.</CommandEmpty>
						<CommandGroup heading="Stores">
							{formattedStores.map((store) => (
								<CommandItem
									key={store.value}
									onSelect={() => handleSelect(store)}
									className="text-sm"
								>
									<StoreIcon className="mr-2 h-4 w-4"/>
									{store.label}
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											currentStore?.value === store.value ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator/>
					<CommandList>
						<CommandGroup>
							<CommandItem
								onSelect={
									() => {
										setIsOpen(false);
										storeModal.onOpen();
									}
								}
							>
								<PlusCircle className="mr-2 h-5 w-5"/>
								Create a new store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	 );
}
 
export default StoreSwitcher;