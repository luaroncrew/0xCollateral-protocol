"use client";

import { useState, useEffect, useRef, FC } from "react";
import { TokenIcon } from "@web3icons/react";
import { ChevronDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { convertTokenToDollars } from "./0x/utils/tokens";
import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES,
} from "@/app/constants/tokens";
import { parseEther } from "viem";

// Helper function to validate and format float input
const validateFloatInput = (value: string): number => {
  // Allow empty input
  if (value === "") return 0;

  // Only allow numbers and one decimal point
  if (!/^\d*\.?\d*$/.test(value)) return NaN;

  // Convert to number, handling empty string case
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

interface TokenInputProps {
  value: number;
  token: string;
  availableTokens: typeof TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES;
  inputFor: "withdraw" | "supply" | "repay" | "borrow";
  onAmountChange: (value: number) => void;
  onTokenChange?: (token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE) => void;
}

export const TokenInput: FC<TokenInputProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState<number>(
    Math.round(Math.random() * 1000) / 1000
  );
  const [inputValue, setInputValue] = useState(props.value.toString());

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update input value when props.value changes
  useEffect(() => {
    setInputValue(props.value.toString());
  }, [props.value]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const validatedValue = validateFloatInput(newValue);
    if (!isNaN(validatedValue)) {
      props.onAmountChange(validatedValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-space-grotesk text-base">Amount</Label>

      <div
        className="relative rounded-lg border border-input bg-white shadow-sm"
        onClick={handleContainerClick}
      >
        {/* Main input container */}
        <div className="flex flex-col">
          {/* Top row with input and token selector */}
          <div className="flex items-center justify-between p-3">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full text-2xl bg-transparent outline-none"
              type="text"
              inputMode="decimal"
              pattern="^\d*\.?\d*$"
            />

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors",
                  (!props.availableTokens || !props.onTokenChange) &&
                    "opacity-80 cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.availableTokens && props.onTokenChange) {
                    setIsDropdownOpen(!isDropdownOpen);
                  }
                }}
                disabled={!props.availableTokens || !props.onTokenChange}
              >
                <span className="mr-1">
                  <TokenIcon size={21} symbol={props.token} variant="branded" />
                </span>
                <span className="font-medium">{props.token}</span>
                {props.availableTokens && props.onTokenChange && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isDropdownOpen && props.onTokenChange && (
                <div className="absolute top-full right-0 mt-1 min-w-[150px] max-h-[250px] overflow-y-auto z-50 bg-white rounded-lg border border-gray-200 shadow-lg">
                  <div className="py-1">
                    {props.availableTokens.map((t) => (
                      <button
                        key={t}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-left hover:bg-gray-100",
                          props.token === t && "bg-gray-50"
                        )}
                        onClick={() => {
                          props.onTokenChange?.(t);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="mr-2 flex-shrink-0">
                          <TokenIcon size={21} symbol={t} variant="branded" />
                        </span>
                        <span className="truncate">{t}</span>
                        {props.token === t && (
                          <Check className="ml-auto h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom row with dollar value and balance */}
          <div className="flex items-center justify-between px-3 pb-3 text-sm">
            <span className="text-muted-foreground">
              ${convertTokenToDollars(props.token, props.value)}
            </span>
            {props.inputFor === "withdraw" && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">
                  Supplied Balance: {balance}
                </span>
                <button
                  type="button"
                  className="
                    ml-1 px-2 py-0.5 text-xs font-medium
                    bg-purple-100 text-purple-700 rounded-full
                    hover:bg-purple-200 transition-colors"
                  onClick={() => {
                    props.onAmountChange(balance);
                  }}
                >
                  Max
                </button>
              </div>
            )}
            {props.inputFor === "supply" && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">
                  Wallet Balance: {balance}
                </span>
                <button
                  type="button"
                  className="
                    ml-1 px-2 py-0.5 text-xs font-medium
                    bg-purple-100 text-purple-700 rounded-full
                    hover:bg-purple-200 transition-colors"
                  onClick={() => {
                    props.onAmountChange(balance);
                  }}
                >
                  Max
                </button>
              </div>
            )}
            {/*{props.balance && (*/}
            {/*  <div className="flex items-center gap-1">*/}
            {/*    <span className="text-muted-foreground">*/}
            {/*      Balance: {props.balance.amount} {props.balance.symbol}*/}
            {/*    </span>*/}
            {/*    {props.balance ? (*/}
            {/*      <button*/}
            {/*        type="button"*/}
            {/*        className="ml-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"*/}
            {/*        onClick={() => {*/}
            {/*          props.onAmountChange(props.balance?.amount || 0);*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        Max*/}
            {/*      </button>*/}
            {/*    ) : undefined}*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </div>
  );
};
