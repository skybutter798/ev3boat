<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Grid;
use App\Models\BlockHash;
use App\Models\Entry;
use App\Models\Reward;
use App\Models\ShopItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Abraham\TwitterOAuth\TwitterOAuth;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;


class HashController extends Controller
{
    public function index()
    {
        $remainingClicks = 0; // Default value
        $remain = \App\Models\Grid::where('clicked', 0)->where('reward_item_id', 1)->get();
        $password = config('assets.password');
        
        if (Auth::check()) {
            $user = Auth::user();
            $remainingClicks = $user->clicks; // Use the clicks column directly
        }
        $userCriteriaFulfilled = false;
    
        if (Auth::check()) {
            $user = Auth::user();
            $grid = Grid::where('user_id', $user->id)
                        ->where('clicked', 1)
                        ->where('reward_item_id', 2)
                        ->first();
            
            if ($grid) {
                $userCriteriaFulfilled = true;
            }
        }
        
        $grids = Grid::all();
        
        // Fetch the latest block hash record
        $latestBlockHash = \App\Models\BlockHash::latest('created_at')->first();
        
        $userEntries = [];
        if (Auth::check()) {
            $user = Auth::user();
            $userEntries = \App\Models\Entry::where('user_id', $user->id)
                ->join('block_hashes', 'entries.blockhash_id', '=', 'block_hashes.id')
                ->select('entries.*', 'block_hashes.hash as actual_result', 'block_hashes.link as hash_link')
                ->orderBy('entries.created_at', 'desc')
                ->get();

        }
        
        $userPoints = 0; // Default value

        if (Auth::check()) {
            $user = Auth::user();
            $remainingClicks = $user->clicks; // Use the clicks column directly
            $userPoints = $user->points; // Fetch the user's points
        }
    
        $pastHashes = \App\Models\BlockHash::orderBy('retrieved_at', 'desc')->paginate(10);
    
        return view('hash', compact('grids', 'remainingClicks', 'remain', 'password', 'userCriteriaFulfilled', 'userEntries', 'pastHashes', 'latestBlockHash', 'userPoints'));
    }

    
    public function handleButtonClick(Request $request)
    {
        $buttonValue = $request->input('buttonValue');
        
        if (!Auth::check()) {
            return response()->json(['message' => 'User not authenticated'], 403);
        }
        
        $user = Auth::user();
        
        if ($user->clicks <= 0) {
            return response()->json(['status' => 'error', 'message' => 'No clicks remaining for today']);
        }
        
        // Deduct a click from the user
        $user->clicks -= 1;
        $user->save();
        
        // Store the user's entry
        $entry = new \App\Models\Entry();
        $entry->user_id = $user->id;
        $entry->entry_value = $buttonValue;
        $entry->save();
        Log::channel('number_click')->info('User ID: ' . $user->id . ' Name: ' . $user->name . ' clicked on number: ' . $buttonValue);

        return response()->json(['status' => 'success', 'message' => 'Entry saved. Wait for the result.', 'remainingClicks' => $user->clicks]);
    }




    
    public function getLatestBlockHash()
    {
        Log::channel('hash_info')->info('Called getLatestBlockHash function'); // Log that the function has been called
    
        $apiKey = '3BAH17RC7NK7SRBR8KE41TUNWBIVNYK4DE'; // Replace with your Etherscan API key
        $url = "https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=$apiKey";
    
        $client = new Client();
        $response = $client->get($url);
        $data = json_decode($response->getBody(), true);
    
        if (isset($data['result']) && isset($data['result']['hash'])) {
            $blockHash = $data['result']['hash'];
            //$blockHash = "abc01";
            $etherscanLink = "https://etherscan.io/block/$blockHash"; // Construct the Etherscan link
    
            Log::channel('hash_info')->info('Successfully retrieved block hash', ['blockHash' => $blockHash, 'etherscanLink' => $etherscanLink]); // Log the block hash and the Etherscan link
    
            // Store the block hash in the database
            $blockHashModel = new BlockHash;
            $blockHashModel->hash = $blockHash;
            $blockHashModel->link = $etherscanLink;
            $blockHashModel->retrieved_at = now(); // Current timestamp
            $blockHashModel->save();
    
            // Check the winning entries after saving the block hash
            $this->checkWinningEntries($blockHash);
    
            return [
                'blockHash' => $blockHash,
                'etherscanLink' => $etherscanLink
            ];
        }
        Log::error('Failed to retrieve block hash from Etherscan'); // Log an error message if the block hash is not found in the response
    
        return null;
    }



    public function checkWinningEntries($latestBlockHash)
    {
        $lastChar = substr($latestBlockHash, -1);
        $blockHashRecord = \App\Models\BlockHash::where('hash', $latestBlockHash)->first();
    
        if (!$blockHashRecord) {
            return;
        }
    
        $pendingEntries = \App\Models\Entry::where('result', 'pending')->get();
    
        foreach ($pendingEntries as $entry) {
            if ($entry->entry_value == $lastChar) {
                $entry->result = 'win';
                $user = $entry->user; // This uses the relationship you set up
                $user->points += 10;
                $user->save();
               Log::channel('hash_info')->info("User {$user->name} won 10, total point : {$user->points}");
            } else {
                $entry->result = 'lose';
            }
    
            $entry->blockhash_id = $blockHashRecord->id;
            $entry->save();
        }
    }
    
    public function getUserEntries() {
        if (Auth::check()) {
            $user = Auth::user();
            $userEntries = \App\Models\Entry::where('user_id', $user->id)
                ->leftJoin('block_hashes', 'entries.blockhash_id', '=', 'block_hashes.id') // Use leftJoin here
                ->select('entries.*', 'block_hashes.hash as actual_result', 'block_hashes.link as hash_link')
                ->orderBy('entries.created_at', 'desc')
                ->get();
    
            return response()->json($userEntries);
        }
        return response()->json([]);
    }
    
    public function getShopItems()
    {
        $items = ShopItem::all();
        return response()->json($items);
    }

    
    public function purchaseItem(Request $request)
    {
        $itemId = $request->input('item_id');
        $user = Auth::user();
    
        $item = \App\Models\ShopItem::find($itemId);
    
        if ($user->points < $item->cost) {
            return response()->json(['status' => 'error', 'message' => 'Not enough points.']);
        }
    
        // If purchasing item 2, check if the user already has a wallet address
        if ($itemId == 2 && !empty($user->wallet_address)) {
            return response()->json(['status' => 'error', 'message' => 'You already got your whitelist ticket.']);
        }
    
        // Deduct points and update user data
        $user->points -= $item->cost;
    
        switch ($itemId) {
            case 1:
                $user->clicks += 2;
                break;
            case 2:
                // Additional logic for item 2 can be added here if needed
                break;
        }
    
        $user->save();
    
        Log::channel('number_click')->info('User ID: ' . $user->id . ' Name: ' . $user->name . ' purchased item with ID: ' . $itemId . ' Balance: ' . $user->points);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Purchase successful!',
            'item_id' => $itemId,
            'updatedPoints' => $user->points,
            'updatedClicks' => $user->clicks
        ]);
    }



    
    public function getPastHashes()
    {
        $pastHashes = \App\Models\BlockHash::orderBy('retrieved_at', 'desc')->paginate(10);
        return response()->json($pastHashes);
    }
    
    public function getUserInfo() {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 403);
        }
    
        return response()->json([
            'points' => $user->points,
            'clicks' => $user->clicks // Assuming you've added a 'clicks' column to your users table
        ]);
    }

    public function getAllEntries(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 10; // Number of entries per page
    
        $entries = \App\Models\Entry::with(['blockHash'])
                    ->where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage, ['*'], 'page', $page);
    
        return response()->json($entries);
    }

    
    public function checkWalletAddress(Request $request)
    {
        $user = Auth::user();

        // Check if the user is authenticated
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 403);
        }

        // Check if the user has a wallet address saved
        $hasWalletAddress = !empty($user->wallet_address);

        return response()->json(['hasWalletAddress' => $hasWalletAddress]);
    }

}